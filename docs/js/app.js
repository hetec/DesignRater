'use strict';

/**
 * Requester Module
 * 
 * Sends generic requests
 */

var Requester = function () {
  var _METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  var _doRequest = function _doRequest(method, endpoint, success, failure) {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function () {
      if (XHR.readyState === 4) {
        if (XHR.status === 200) {
          var data = JSON.parse(XHR.responseText);
          success(data);
        }
        if (XHR.status >= 400) {
          failure();
        }
      }
    };

    XHR.open(method, encodeURI(endpoint), true);
    XHR.send();
  };

  return {
    doRequest: _doRequest,
    METHODS: _METHODS
  };
}();
/**
 * DesignRequests Module
 * 
 * Provides methods to interact with the designs endpoint of
 * spreadshirts REST api
 */

var DesignRequests = function (requester) {
  var _mediaType = 'json';
  var _endpoit = 'designs';
  var _baseUrl = void 0;
  var _shopId = void 0;
  var _limit = void 0;

  var _getLimit = function _getLimit() {
    return _limit;
  };

  var _buildUri = function _buildUri(query, offset, limit) {
    return _baseUrl + '/' + _shopId + '/' + _endpoit + '?mediaType=' + _mediaType + '&query=' + query + '&offset=' + offset + '&limit=' + limit;
  };

  var _getDesignsForQuery = function _getDesignsForQuery(query, offset, success, failure) {
    var uri = _buildUri(query, offset, _limit);
    requester.doRequest(requester.METHODS.GET, uri, success, failure);
  };

  var _init = function _init(config) {
    config = config || {};
    _baseUrl = config.url || 'https://api.spreadshirt.net/api/v1/shops';
    _shopId = config.shopId || '205909';
    _limit = config.limit || 5;
  };

  return {
    getDesignsForQuery: _getDesignsForQuery,
    getLimit: _getLimit,
    init: _init
  };
}(Requester);

/**
 * Rating Module
 * 
 * Provides the functionality to rate designs and
 * stores the already rated ones
 */
var RatingService = function () {

  var _ratingState = {};
  var _positiveRatesArrayName = 'positive';
  var _negativeRatesArrayName = 'negative';

  var _addQuery = function _addQuery(query) {
    if (!_queryExists(query)) {
      _ratingState[query] = {
        name: '',
        negative: [],
        positive: []
      };
    }
  };

  var _getRatings = function _getRatings() {
    return _ratingState;
  };

  var _nothingRated = function _nothingRated() {
    for (var query in _ratingState) {
      if (_ratingState[query].negative.length > 0 || _ratingState[query].positive.length > 0) {
        return false;
      }
    }
    return true;
  };

  var _getRatingForDesign = function _getRatingForDesign(query, designName) {
    if (_queryExists(query)) {
      if (_ratingState[query].positive.indexOf(designName) >= 0) {
        return _positiveRatesArrayName;
      }
      if (_ratingState[query].negative.indexOf(designName) >= 0) {
        return _negativeRatesArrayName;
      }
      return '';
    }
  };

  var _queryExists = function _queryExists(query) {
    return _ratingState.hasOwnProperty(query);
  };

  var _designRated = function _designRated(query, design) {
    return _ratingState[query][_positiveRatesArrayName].indexOf(design) >= 0 || _ratingState[query][_negativeRatesArrayName].indexOf(design) >= 0;
  };

  var _like = function _like(query, design) {
    if (!_designRated(query, design) && _queryExists(query)) {
      console.log('design', design);

      _ratingState[query][_positiveRatesArrayName].push(design);
    }
  };

  var _dislike = function _dislike(query, design) {
    if (!_designRated(query, design) && _queryExists(query)) {
      _ratingState[query][_negativeRatesArrayName].push(design);
    }
  };

  var _reset = function _reset() {
    _ratingState = {};
  };

  return {
    addQuery: _addQuery,
    designRated: _designRated,
    like: _like,
    dislike: _dislike,
    reset: _reset,
    getRatings: _getRatings,
    getRatingForDesign: _getRatingForDesign,
    nothingRated: _nothingRated
  };
}();

/**
 * Design Factory
 * 
 * Enables creation of Design objects
 */

var Design = function Design(id, name, imageUrl) {
  return {
    id: id,
    name: name,
    imageUrl: imageUrl
  };
};
/**
 * Renderer Module
 * 
 * Provides methods to create and alter view elements
 */

var Renderer = function () {

  var _ratingSummeryId = void 0;
  var _designContainerId = void 0;
  var _designImgClass = void 0;
  var _queryNameClass = void 0;
  var _totalRatingsClass = void 0;
  var _barGroupClass = void 0;
  var _barClass = void 0;
  var _barFillClass = void 0;
  var _hideClass = void 0;
  var _numberOfRatingsClass = void 0;
  var _posRatingBtnContent = void 0;
  var _negRatingBtnContent = void 0;
  var _maxBarWidth = void 0;

  var _init = function _init(config) {
    config = config || {};
    _ratingSummeryId = config.ratingSummeryId || 'ratingSummery';
    _designContainerId = config.designContainerId || 'designContainer';
    _designImgClass = config.designImgClass || 'designImage';
    _queryNameClass = config.queryNameClass || 'queryName';
    _totalRatingsClass = config.totalRatingsClass || 'totalRatings';
    _barGroupClass = config.barGroupClass || 'barGroup';
    _barClass = config.barClass || 'bar';
    _barFillClass = config.barFillClass || 'barFill';
    _numberOfRatingsClass = config.numberOfRatingsClass || 'numberOfRatings';
    _hideClass = config.hideClass || 'hide';
    _posRatingBtnContent = config.posRatingBtnContent || '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
    _negRatingBtnContent = config.negRatingBtnContent || '<i class="fa fa-thumbs-down" aria-hidden="true"></i>';
    _maxBarWidth = config.maxBarWidth || 300;
  };

  var _render = function _render(containerId, content) {
    var container = document.getElementById(containerId);
    var currentContainerContent = document.getElementById(_designContainerId);
    var designContainer = document.createElement('div');
    designContainer.id = _designContainerId;
    designContainer.classList.add(_designContainerId);
    designContainer.innerHTML = content;
    container.replaceChild(designContainer, currentContainerContent);
  };

  var _renderDesign = function _renderDesign(containerId, design) {
    var content = '<img src="' + design.imageUrl + '" alt="' + design.name + '" class=' + _designImgClass + '>';
    _render(containerId, content);
  };

  var _renderNotFound = function _renderNotFound(containerId, msg) {
    var container = document.getElementById(containerId);
    container.innerHTML = msg;
  };

  var _renderRatingSummery = function _renderRatingSummery(ratings) {
    for (var rating in ratings) {
      document.getElementById(_ratingSummeryId).appendChild(_renderSingleRating(ratings[rating], rating));
    }
  };

  var _clearRatingSummery = function _clearRatingSummery() {
    document.getElementById('ratingSummery').innerHTML = "";
  };

  var _renderSingleRating = function _renderSingleRating(queryRating, queryName) {
    var totalOfQuery = queryRating.positive.length + queryRating.negative.length;

    console.log('total', totalOfQuery);

    var ratingResult = document.createElement('div');
    var totalNumber = document.createElement('span');
    var query = document.createElement('span');

    totalNumber.innerHTML = totalOfQuery;
    query.innerHTML = queryName;

    totalNumber.classList.add(_totalRatingsClass);
    query.classList.add(_queryNameClass);

    ratingResult.appendChild(totalNumber);
    ratingResult.appendChild(query);
    ratingResult.appendChild(_renderRatingBar(queryRating.positive.length, totalOfQuery, _posRatingBtnContent));
    ratingResult.appendChild(_renderRatingBar(queryRating.negative.length, totalOfQuery, _negRatingBtnContent));

    return ratingResult;
  };

  var _renderRatingBar = function _renderRatingBar(numberOfRatings, totalRatings, labelContent) {
    var maxWidth = _maxBarWidth;
    var maxWidthWithoutBorder = maxWidth - 2;
    var w = numberOfRatings / totalRatings * maxWidthWithoutBorder + 'px';

    var barGroup = document.createElement('div');
    var bar = document.createElement('div');
    var barFill = document.createElement('div');
    var label = document.createElement('span');
    var numberOfCurrentRatings = document.createElement('div');

    barGroup.classList.add(_barGroupClass);
    bar.classList.add(_barClass);
    barFill.classList.add(_barFillClass);
    numberOfCurrentRatings.classList.add(_numberOfRatingsClass);

    numberOfCurrentRatings.innerHTML = numberOfRatings;
    label.innerHTML = labelContent;

    bar.style.width = maxWidth;
    barFill.style.width = w;

    bar.appendChild(numberOfCurrentRatings);
    bar.appendChild(barFill);
    barGroup.appendChild(label);
    barGroup.appendChild(bar);

    return barGroup;
  };

  var _hide = function _hide(element) {
    var classList = element.classList;
    if (!classList.contains(_hideClass)) {
      classList.add(_hideClass);
    }
  };

  var _show = function _show(element) {
    var classList = element.classList;
    if (classList.contains(_hideClass)) {
      classList.remove(_hideClass);
    }
  };

  return {
    renderDesign: _renderDesign,
    renderNotFound: _renderNotFound,
    renderRatingSummery: _renderRatingSummery,
    clearRatingSummery: _clearRatingSummery,
    hide: _hide,
    show: _show,
    init: _init
  };
}();
// Handler Module

var ViewDesigns = function (designRequests, renderer, rating) {

  var offset = 0;
  var currentQuery = '';
  var currentDesigns = [];
  var total = 0;
  var currentIndex = 1;
  var currentPos = 1;

  // Dom elements
  var searchBtn = document.getElementById('sendSearch');
  var likeBtn = document.getElementById('like');
  var dislikeBtn = document.getElementById('dislike');
  var nextBtn = document.getElementById('next');
  var summeryContainer = document.getElementById('ratingSummeryContainer');
  var designArea = document.getElementById('currentDesign');
  var ratingBtns = document.getElementById('ratingBtns');
  var choosenRating = document.getElementById('choosenRating');
  var finishRatingBtn = document.getElementById('finishRating');
  var errorMsg = document.getElementById('errorMsg');
  var searchField = document.getElementById('query');
  var _logo = document.getElementById('logo');

  var _handleAllQuery = function _handleAllQuery(query) {
    if (!query) {
      query = 'all';
    }
    return query;
  };

  var _searchDesign = function _searchDesign() {
    searchBtn.addEventListener('click', function () {
      _searchHandler();
    });

    searchField.addEventListener('keydown', function (keyEvent) {
      if (keyEvent.keyCode === 13) {
        _searchHandler();
      }
    });
  };

  var _searchHandler = function _searchHandler() {
    offset = 0;
    currentQuery = _handleAllQuery(searchField.value);
    rating.addQuery(currentQuery);
    searchField.value = '';
    DesignRequests.getDesignsForQuery(currentQuery, offset, function (result) {
      renderer.hide(_logo);
      _handleSearchResult(result);
      _updateDesignView(0, 'No results available for: ' + currentQuery);
      _resetCurrentIndex();
      _setTotalAmount();
    }, function () {
      renderer.renderNotFound('errorMsg', 'An error occured during the request!');
      renderer.hide(designArea);
      renderer.show(errorMsg);
    });
  };

  var _showRating = function _showRating() {

    var design = currentDesigns[currentPos - 1];
    if (design) {
      if (rating.designRated(currentQuery, design.id)) {
        renderer.hide(ratingBtns);
        renderer.show(choosenRating);
        _setChoosenRating(currentQuery, design.id);
      } else {
        renderer.hide(choosenRating);
        renderer.show(ratingBtns);
      }
    }
  };

  var _likeDesign = function _likeDesign() {
    likeBtn.addEventListener('click', function () {
      rating.like(currentQuery, currentDesigns[currentPos - 1].id);
      _setChoosenRating(currentQuery, currentDesigns[currentPos - 1].id);
      _showRatingBtn();
      renderer.hide(ratingBtns);
      renderer.show(choosenRating);
    });
  };

  var _dislikeDesign = function _dislikeDesign() {
    document.getElementById('dislike').addEventListener('click', function () {
      rating.dislike(currentQuery, currentDesigns[currentPos - 1].id);
      _setChoosenRating(currentQuery, currentDesigns[currentPos - 1].id);
      _showRatingBtn();
      renderer.hide(ratingBtns);
      renderer.show(choosenRating);
    });
  };

  var _setChoosenRating = function _setChoosenRating(query, design) {
    var choosenRatingValue = rating.getRatingForDesign(query, design);
    if (choosenRatingValue === 'positive') {
      choosenRating.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
    } else {
      choosenRating.innerHTML = '<i class="fa fa-thumbs-down" aria-hidden="true"></i>';
    }
  };

  var _handleSearchResult = function _handleSearchResult(result) {
    currentDesigns = result.designs;
    total = result.count;
  };

  var _showRatingBtn = function _showRatingBtn() {
    if (!rating.nothingRated()) {
      finishRatingBtn.disabled = false;
    }
  };

  var _updateDesignView = function _updateDesignView(currentPos, msgForNoDesigns) {
    if (currentDesigns.length > 0) {
      var currentDesign = currentDesigns[currentPos];
      var design = Design(currentDesign.id, currentDesign.name, currentDesign.resources[0].href);
      renderer.renderDesign('currentDesign', design);
      _setCurrentIndex();
      renderer.show(finishRatingBtn);
      renderer.show(designArea);
      renderer.show(nextBtn);
      _showRating();
      renderer.hide(errorMsg);
    } else {
      renderer.renderNotFound('errorMsg', msgForNoDesigns);
      renderer.hide(designArea);
      renderer.show(errorMsg);
    }
  };

  var _setRatingSummery = function _setRatingSummery() {
    finishRatingBtn.addEventListener('click', function () {
      renderer.show(summeryContainer);
      renderer.hide(finishRatingBtn);
      renderer.renderRatingSummery(rating.getRatings());
    });
  };

  var _closeSummery = function _closeSummery() {
    document.getElementById('closeSummery').addEventListener('click', function () {
      rating.reset();
      renderer.clearRatingSummery();
      renderer.hide(designArea);
      renderer.hide(summeryContainer);
      renderer.hide(finishRatingBtn);
      renderer.show(_logo);
      finishRatingBtn.disabled = true;
    });
  };

  var _setTotalAmount = function _setTotalAmount() {
    document.getElementById('totalAmount').innerHTML = total;
  };

  var _setCurrentIndex = function _setCurrentIndex() {
    document.getElementById('currentIndex').innerHTML = currentIndex;
    currentIndex++;
  };

  var _resetCurrentIndex = function _resetCurrentIndex() {
    currentIndex = 1;
    _setCurrentIndex();
  };

  var _nextDesignsAvailable = function _nextDesignsAvailable() {
    return offset + currentDesigns.length < total;
  };

  var _nextDesign = function _nextDesign() {
    nextBtn.addEventListener("click", function () {
      if (currentPos < currentDesigns.length) {
        _updateDesignView(currentPos);
        currentPos++;
        _showRating();
      } else {
        if (_nextDesignsAvailable()) {
          offset = offset + designRequests.getLimit();
          DesignRequests.getDesignsForQuery(currentQuery, offset, function (result) {
            currentPos = 1;
            _handleSearchResult(result);
            _updateDesignView(0);
            _showRating();
          });
        } else {
          currentDesigns = [];
          currentPos = 1;
          _updateDesignView(0, "No more designs available for this query");
        }
      }
    });
  };

  var initHandlers = function initHandlers() {
    _searchDesign();
    _nextDesign();
    _likeDesign();
    _dislikeDesign();
    _setRatingSummery();
    _closeSummery();
  };

  return {
    initHandlers: initHandlers
  };
}(DesignRequests, Renderer, RatingService);

// Main

Renderer.init();
DesignRequests.init({ limit: 500 });
ViewDesigns.initHandlers();
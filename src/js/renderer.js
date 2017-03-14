/**
 * Renderer Module
 * 
 * Provides methods to create and alter view elements
 */

const Renderer = (function() {

  let _ratingSummeryId;
  let _designContainerId;
  let _designImgClass;
  let _queryNameClass;
  let _totalRatingsClass;
  let _barGroupClass
  let _barClass;
  let _barFillClass;
  let _hideClass;
  let _numberOfRatingsClass;
  let _posRatingBtnContent;
  let _negRatingBtnContent;
  let _maxBarWidth;

  const _init = (config) => {
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
  }

  const _render = (containerId, content) => {
    let container = document.getElementById(containerId);
    let currentContainerContent = document.getElementById(_designContainerId);
    let designContainer = document.createElement('div');
    designContainer.id = _designContainerId;
    designContainer.classList.add(_designContainerId);
    designContainer.innerHTML = content;
    container.replaceChild(designContainer, currentContainerContent);
  }

  const _renderDesign = (containerId, design) => {
    const content = 
      '<img src="' + design.imageUrl 
      + '" alt="' + design.name
      + '" class=' + _designImgClass + '>';
    _render(containerId, content);
  }

  const _renderNotFound = (containerId, msg) => {
    let container = document.getElementById(containerId);
    container.innerHTML = msg;
  }

  const _renderRatingSummery = (ratings) => {
    for (let rating in ratings) {
      document.getElementById(_ratingSummeryId).appendChild(_renderSingleRating(ratings[rating], rating));
    }
  }

  const _clearRatingSummery = () => {
    document.getElementById('ratingSummery').innerHTML = "";
  }

  const _renderSingleRating = (queryRating, queryName) => {
    let totalOfQuery = queryRating.positive.length + queryRating.negative.length;

    console.log('total', totalOfQuery);

    let ratingResult = document.createElement('div');
    let totalNumber = document.createElement('span');
    let query = document.createElement('span');

    totalNumber.innerHTML = totalOfQuery;
    query.innerHTML = queryName;

    totalNumber.classList.add(_totalRatingsClass);
    query.classList.add(_queryNameClass);

    ratingResult.appendChild(totalNumber);
    ratingResult.appendChild(query);
    ratingResult.appendChild(_renderRatingBar(
      queryRating.positive.length, totalOfQuery, _posRatingBtnContent));
    ratingResult.appendChild(_renderRatingBar(
      queryRating.negative.length, totalOfQuery, _negRatingBtnContent));

    return ratingResult;
  }

  const _renderRatingBar = (numberOfRatings, totalRatings, labelContent) => {
    let maxWidth = _maxBarWidth;
    let maxWidthWithoutBorder = maxWidth - 2;
    let w = (numberOfRatings / totalRatings) * maxWidthWithoutBorder + 'px';

    let barGroup = document.createElement('div');
    let bar = document.createElement('div');
    let barFill = document.createElement('div');
    let label = document.createElement('span');
    let numberOfCurrentRatings = document.createElement('div');

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
  }

  const _hide = (element) => {
    const classList = element.classList;
    if(!classList.contains(_hideClass)){
      classList.add(_hideClass);
    }
  }

  const _show = (element) => {
    const classList = element.classList;
    if(classList.contains(_hideClass)){
      classList.remove(_hideClass);
    }
  }

  return {
    renderDesign: _renderDesign,
    renderNotFound: _renderNotFound,
    renderRatingSummery: _renderRatingSummery,
    clearRatingSummery: _clearRatingSummery,
    hide: _hide,
    show: _show,
    init: _init
  }
})();
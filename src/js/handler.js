// Handler Module

const ViewDesigns = (function(designRequests, renderer, rating){

  let offset = 0;
  let currentQuery = '';
  let currentDesigns = [];
  let total = 0;
  let currentIndex = 1;
  var currentPos = 1;

  // Dom elements
  const searchBtn = document.getElementById('sendSearch');
  const likeBtn = document.getElementById('like');
  const dislikeBtn = document.getElementById('dislike');
  const nextBtn = document.getElementById('next');
  const summeryContainer = document.getElementById('ratingSummeryContainer');
  const designArea = document.getElementById('currentDesign');
  const ratingBtns = document.getElementById('ratingBtns');
  const choosenRating = document.getElementById('choosenRating');
  const finishRatingBtn = document.getElementById('finishRating');
  const errorMsg = document.getElementById('errorMsg');
  const searchField = document.getElementById('query');
  const _logo = document.getElementById('logo');

  const _handleAllQuery = (query) => {
    if(!query) {
      query = 'all';
    }
    return query;
  }

  const _searchDesign = () => {
    searchBtn.addEventListener('click', () => {
      _searchHandler();
    });

    searchField.addEventListener('keydown', (keyEvent) => {
      if(keyEvent.keyCode === 13){
        _searchHandler();
      }
    })
  }

  const _searchHandler = () => {
    offset = 0;
    currentQuery = _handleAllQuery(searchField.value);
    rating.addQuery(currentQuery);
    searchField.value = '';
    DesignRequests.getDesignsForQuery(currentQuery, offset, (result) => {
      renderer.hide(_logo);
      _handleSearchResult(result);
      _updateDesignView(0, 'No results available for: ' + currentQuery);
      _resetCurrentIndex();
      _setTotalAmount();
    }, () => {
      renderer.renderNotFound('errorMsg', 'An error occured during the request!');
      renderer.hide(designArea);
      renderer.show(errorMsg);
    });
  }

  const _showRating = () => {
    let design = currentDesigns[currentPos - 1].name;
    if (rating.designRated(currentQuery, design)){
      renderer.hide(ratingBtns);
      renderer.show(choosenRating);
      _setChoosenRating(currentQuery, currentDesigns[currentPos - 1].name);
    } else {
      renderer.hide(choosenRating);
      renderer.show(ratingBtns);
    }
  }

  const _likeDesign = () => {
    likeBtn.addEventListener('click', () => {
      console.log(currentDesigns[currentPos - 1]);
      rating.like(currentQuery, currentDesigns[currentPos - 1].id);
      _setChoosenRating(currentQuery, currentDesigns[currentPos - 1].id);
      _showRatingBtn();
      renderer.hide(ratingBtns);
      renderer.show(choosenRating);
    });
  }

  const _dislikeDesign = () => {
    document.getElementById('dislike').addEventListener('click', () => {
      rating.dislike(currentQuery, currentDesigns[currentPos - 1].id);
      _setChoosenRating(currentQuery, currentDesigns[currentPos - 1].id);
      _showRatingBtn();
      renderer.hide(ratingBtns);
      renderer.show(choosenRating);
    });
  }

  const _setChoosenRating = (query, design) => {
    let choosenRatingValue = rating.getRatingForDesign(query, design);
    if (choosenRatingValue === 'positive'){
      choosenRating.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
    } else {
      choosenRating.innerHTML = '<i class="fa fa-thumbs-down" aria-hidden="true"></i>';
    }
  }

  const _handleSearchResult = (result) => {
    currentDesigns = result.designs;
    total = result.count;
  }

  const _showRatingBtn = () => {
    if (!rating.nothingRated()){
      finishRatingBtn.disabled = false;
    }
  }

  const _updateDesignView = (currentPos, msgForNoDesigns) => {
    if(currentDesigns.length > 0) { 
      let currentDesign = currentDesigns[currentPos];
      let design = Design(currentDesign.id, currentDesign.name, currentDesign.resources[0].href)
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
  }

  const _setRatingSummery = () => {
    finishRatingBtn.addEventListener('click', () => {
      renderer.show(summeryContainer);
      renderer.hide(finishRatingBtn);
      renderer.renderRatingSummery(rating.getRatings());
    });
  }

  const _closeSummery = () => {
    document.getElementById('closeSummery').addEventListener('click', () => {
      rating.reset()
      renderer.clearRatingSummery();
      renderer.hide(designArea);
      renderer.hide(summeryContainer);
      renderer.hide(finishRatingBtn);
      renderer.show(_logo);
      finishRatingBtn.disabled = true;
    });
  }

  const _setTotalAmount = () => {
    document.getElementById('totalAmount').innerHTML = total;
  }

  const _setCurrentIndex = () => {
    document.getElementById('currentIndex').innerHTML = currentIndex;
    currentIndex++;
  }

  const _resetCurrentIndex = () => {
    currentIndex = 1
    _setCurrentIndex();
  }

  const _nextDesignsAvailable = () => {
    return offset + currentDesigns.length < total;
  }

  const _nextDesign = () => {
    nextBtn.addEventListener("click", () => {
      if(currentPos < currentDesigns.length){
        _updateDesignView(currentPos);
        currentPos++;
        _showRating();
      } else {
        if (_nextDesignsAvailable()){
          offset = offset + designRequests.getLimit();
          DesignRequests.getDesignsForQuery(currentQuery, offset, (result) => {
            currentPos = 1;
            _handleSearchResult(result);
            _updateDesignView(0);
            _showRating();
          });
        }else {
          currentDesigns = [];
          _updateDesignView(0, "No more designs available for this query");
        }
      }
    });
  }

  const initHandlers = () => {
    _searchDesign();
    _nextDesign();
    _likeDesign();
    _dislikeDesign();
    _setRatingSummery();
    _closeSummery();
    _searchDesignKeyBinding();
  }

  return {
    initHandlers: initHandlers
  }

})(DesignRequests, Renderer, RatingService);

// Main

Renderer.init();
DesignRequests.init();
ViewDesigns.initHandlers();
/**
 * Rating Module
 * 
 * Provides the functionality to rate designs and
 * stores the already rated ones
 */
const RatingService = (() => {

  let _ratingState = {}
  const _positiveRatesArrayName = 'positive';
  const _negativeRatesArrayName = 'negative';

  const _addQuery = (query) => {
    if(!_queryExists(query)) {
      _ratingState[query] = {
        name: '',
        negative: [],
        positive: []
      }
    }
  };

  const _getRatings = () => {
    return _ratingState;
  };

  const _nothingRated = () => {
    for(let query in _ratingState) {
      if(_ratingState[query].negative.length > 0 
        || _ratingState[query].positive.length > 0){
        return false;
      }
    }
    return true;
  };

  const _getRatingForDesign = (query, designName) => {
    if(_queryExists(query)){
      if(_ratingState[query].positive.indexOf(designName) >= 0){
        return _positiveRatesArrayName;
      }
      if(_ratingState[query].negative.indexOf(designName) >= 0){
        return _negativeRatesArrayName;
      }
      return '';
    }
  };

  const _queryExists = (query) => {
    return _ratingState.hasOwnProperty(query);
  };

  const _designRated = (query, design) => {
    return (_ratingState[query][_positiveRatesArrayName].indexOf(design) >= 0 
      || _ratingState[query][_negativeRatesArrayName].indexOf(design) >= 0);
  };

  const _like = (query, design) => {
    if((!_designRated(query, design)) && _queryExists(query)) {
      _ratingState[query][_positiveRatesArrayName].push(design);
    }
  };

  const _dislike = (query, design) => {
    if((!_designRated(query, design)) && _queryExists(query)) {
      _ratingState[query][_negativeRatesArrayName].push(design);
    }
  };

  const _reset = () => {
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
  }

})();

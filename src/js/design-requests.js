/**
 * DesignRequests Module
 * 
 * Provides methods to interact with the design endpoint of
 * spreadshirts REST api
 */

const DesignRequests = ((requester) => {
  const _mediaType = 'json';
  const _endpoit = 'designs'
  let _baseUrl;
  let _shopId;
  let _limit;

  const _getLimit = () => {
    return _limit;
  };

  const _buildUri = (query, offset, limit) => {
    return _baseUrl 
      + '/' + _shopId
      + '/' + _endpoit 
      + '?mediaType=' + _mediaType 
      + '&query=' + query
      + '&offset=' + offset
      + '&limit=' + limit;
  };

  const _getDesignsForQuery = (query, offset, success, failure) => {
    const uri = _buildUri(query, offset, _limit)
    requester.doRequest(requester.METHODS.GET, uri, success, failure);
  };

  const _init = (config) => {
    config = config || {};
    _baseUrl = config.url || 'https://api.spreadshirt.net/api/v1/shops';
    _shopId = config.shopId || '205909';
    _limit = config.limit || 5;
  };

  return {
    getDesignsForQuery: _getDesignsForQuery,
    getLimit: _getLimit,
    init: _init
  }
})(Requester);

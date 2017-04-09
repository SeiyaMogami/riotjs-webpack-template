'use strict';

const apigClientFactory = require('aws-api-gateway-client');
const apigwConfig = require('config').apigw;

let Api = function(session) {
  const config = {
    accessKey: session.AccessKeyId,
    secretKey: session.SecretKey,
    sessionToken: session.SessionToken,
    region: apigwConfig.region,
    invokeUrl: apigwConfig.url
  };
  this.idToken = session.idToken;
  this.apigClient = apigClientFactory.newClient(config);
};

Api.prototype.getUsers = function(callback) {
  const params = {
    path: '/api/nutritionist/assignees',
    method: 'GET',
    params: {
      headers: {},
      queryParams: {}
    }
  };
  callApi(this, params, callback);
};

Api.prototype.getUserWeights = function(uid, offset, callback) {
  const params = {
    path: '/api/nutritionist/assignee/weights',
    method: 'GET',
    params: {
      headers: {},
      queryParams: {
        uid: uid,
        offset: offset
      }
    }
  };
  callApi(this, params, callback);
};

Api.prototype.getUserProfile = function(uid, callback) {
  const params = {
    path: '/api/nutritionist/assignee/profile',
    method: 'GET',
    params: {
      headers: {},
      queryParams: {
        uid: uid
      }
    }
  };
  callApi(this, params, callback);
};

Api.prototype.postWeightObjective = function(uid, weight, callback) {
  const params = {
    path: '/api/nutritionist/assignee/objectives/weight',
    method: 'POST',
    params: {
      headers: {},
      queryParams: {}
    },
    body: {
      uid: uid,
      weight: weight
    }
  };
  callApi(this, params, callback);
};

Api.prototype.postActionObjective = function(uid, action, callback) {
  const params = {
    path: '/api/nutritionist/assignee/objectives/action',
    method: 'POST',
    params: {
      headers: {},
      queryParams: {}
    },
    body: {
      uid: uid,
      action: action
    }
  };
  callApi(this, params, callback);
};

Api.prototype.getInquiries = function(uid, callback) {
  const params = {
    path: '/api/nutritionist/assignee/inquiry',
    method: 'GET',
    params: {
      headers: {},
      queryParams: {
        uid: uid
      }
    }
  };
  callApi(this, params, function(err, result) {
    if (err || result.status !== 200) {
      callback(err || 'エラーが発生しました');
    } else {
      callback(null, result.data);
    }
  });
};

function callApi(api, param, callback) {
  param.params.headers['Eiyo-Authentication'] = api.idToken;
  api.apigClient.invokeApi(param.pathParams, param.path, param.method, param.params, param.body)
    .then(function(result) {
      callback(null, result);
    }).catch(function(err) {
      callback(err);
    });
}

module.exports = Api;

import Firebase from 'firebase';
import {Promise} from 'es6-promise';


// TODO: Use websockets to get real time updates to Action Creators!!


let _authenticateUser = () => {
  let ref = new Firebase(process.env.FIREBASE_URL);

  return new Promise((resolve, reject) => {

    ref.authWithOAuthPopup("github", (error, authData) => {
      if (error) {
        console.log("Login Failed!", error);
        reject();
      } else {
        console.log("Authenticated successfully with payload:", authData);

        let userRef = ref.child('users').child(authData.uid).update({
          id: authData.uid,
          name: authData.github.displayName
        });

        _findLeaguesForUserID(authData.uid).then((leagueInfo) => {
          resolve({
            id: authData.uid,
            name: authData.github.displayName,
            leaguesUserIsIn: leagueInfo
          });
        });
      }
    });

  });
}

let _findLeaguesForUserID = (user) => {

  let ref = new Firebase(process.env.FIREBASE_URL + '/users/' + user + '/leagues');

  let userInLeague = false;

  return new Promise((resolve, reject) => {

    ref.once("value", (snapshot) => {

      userInLeague = snapshot.val() ? true : false;

      resolve({ inLeague: userInLeague, info: snapshot.val() });

    }, (err) => {
      reject(err.code);
    });

  });

}

let _getAllLeagues = () => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);

    ref.child('leagues').once("value", (snapshot) => {
      resolve(snapshot.val());
    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });
  });
}

let _createLeague = (info) => {

  console.log("saving at: " + process.env.FIREBASE_URL + "/leagues");

  let ref = new Firebase(process.env.FIREBASE_URL);

  ref.child('leagues').child(info.name).set(info);
  ref.child('drafts').child(info.name).set({
    started: false,
    completed: false,
    onTheClock: 0,
    round: 0,
    owner: info.ownerId
  });
  ref.child('drafts').child(info.name).child('members').set([{
    id: info.ownerId
  }]);
  ref.child('users').child(info.ownerId).child('leagues').push({
    'name': info.name
  });
}

let _getPlayerStats = () => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL + "/mlb-data-app/players-stats");

    ref.on("value", (snapshot) => {
      resolve(snapshot.val());
    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });
  });
}

let _getDraftDetailsForId = (id) => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);

    ref.child('drafts').once("value", (snapshot) => {
      resolve(snapshot.val()[id]);
    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });
  });
}

let _updateDraftDetails = (update) => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);
    ref.child('drafts').child(update.id).update(update.details);

    ref.child('drafts').once("value", (snapshot) => {
      resolve(snapshot.val()[update.id]);
    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });

  });
}

let _joinLeague = (name, userId) => {

  // first find all leagues and then filter out
  // ones member is not a part of

  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);

    ref.child('users').child(userId).child('leagues').once("value", (snapshot) => {

      let userLeagues = snapshot.val();

      let leagues = [];

      for(var key in userLeagues) {
        if(userLeagues[key].name === name) {
          resolve(false);
          return;
        }
      }

      ref.child('leagues').child(name).child('members').push(userId);

      resolve(true);

    }, (err) => {
      reject(err.code);
    });
  });
}

let _getDraftDataForID = (id) => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);

    ref.child('drafts').once("value", (snapshot) => {
      resolve({ started: (snapshot.val() || {})[id].started });
    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });
  });
}

let _addPlayerToRoster = (leagueId, user, player) => {
  return new Promise((resolve, reject) => {
    let ref = new Firebase(process.env.FIREBASE_URL);

    ref.child('drafts').child(leagueId).child('members').once("value", (snapshot) => {

      let updateId = '',
          members = snapshot.val();

      for(let key in members) {

        if(members[key].id === user.id) {
          updateId = key;
          break;
        }
      }

      ref.child('drafts').child(leagueId).child('members').child(updateId).child('team')
      .child(player.PlayerID).set(player);

      ref.child('drafts').once("value", (snapshot) => {
        resolve((snapshot.val() || {})[leagueId]);
      }, (err) => {
        console.log('failed to get firebase data ' + err.code);
        reject(err.code);
      });

    }, (err) => {
      console.log('failed to get firebase data ' + err.code);
      reject(err.code);
    });
  });
}

let _clearData = (user) => {
  let ref = new Firebase(process.env.FIREBASE_URL);
  ref.child('leagues').set({});
  ref.child('drafts').set({});
  ref.child('users').child(user).child('leagues').set({});
}

export default {
  authenticateUser: _authenticateUser,
  findLeaguesForUserID: _findLeaguesForUserID,
  createLeague: _createLeague,
  getPlayerStats: _getPlayerStats,
  getAllLeagues: _getAllLeagues,
  getDraftDetailsForId: _getDraftDetailsForId,
  updateDraftDetails: _updateDraftDetails,
  joinLeague: _joinLeague,
  clearData: _clearData,
  addPlayerToRoster: _addPlayerToRoster
}

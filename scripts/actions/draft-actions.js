import alt from '../alt';
import firebaseAPI from '../utils/firebase-mlb-api';

class DraftActions {

  getDraftDetailsForId(id) {
    firebaseAPI.getDraftDetailsForId(id).then((result) => {
      this.dispatch(result);
    });
  }

  updateDraftStatus(update) {
    firebaseAPI.updateDraftStatus(update).then((result) => {
      this.dispatch(result);
    });
  }

  addPlayerToRoster(player, user) {
    firebaseAPI.addPlayerToRoster(player, user).then((result) => {
      // dispatch the whole updated draft object
      this.dispatch(result);
    });
  }

}

export default alt.createActions(DraftActions);

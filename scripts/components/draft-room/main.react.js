import React from 'react/addons';
import Router from 'react-router';
import StatsActions from '../../actions/stats-actions';
import DraftActions from '../../actions/draft-actions';
import StatsStore from '../../stores/stats-store';
import LeagueStore from '../../stores/league-store';
import DraftStore from '../../stores/draft-store';
import UserStore from '../../stores/user-store';
import DraftStatus from './draft-status.react';
import DraftBoard from './draft-board.react';
import Rosters from './rosters.react';
import Memberboard from './member-board.react';
import Helpers from '../../utils/helpers';
import ListenerMixin from 'alt/mixins/ListenerMixin';

let PureRenderMixin = React.addons.PureRenderMixin;

/**
 * Drafts are snapshottable
 *
 * memberList, draftPosition, playerSelectionBoard,
 * team selections
 *
 */

export default React.createClass({

  mixins: [Router.State, PureRenderMixin, ListenerMixin],

  getInitialState() {
    return { stats: [], draftDetails: {}, loaded: false }
  },

  componentDidMount() {
    this.listenTo(StatsStore, this._updatePlayerStats);
    this.listenTo(DraftStore, this._updateDraftDetails);

    DraftActions.getDraftDetailsForId(this.getParams().name);
    StatsActions.getStats();
  },

  _getStatsFromStore() {
    this.setState({
      stats: StatsStore.getAllStats()
    });
  },

  _updatePlayerStats() {
    this._getStatsFromStore();
  },

  _updateDraftDetails() {
    this.setState({
      draftDetails: DraftStore.getDraftDetails(),
      loaded: true
    });
    this.forceUpdate();
  },

  render() {
    let name = this.getParams().name;

    return (
      <div>
        <h1>{this.getParams().name} Draft Room</h1>
        <DraftStatus id={this.getParams().name} details={this.state.draftDetails} />
        <Memberboard id={this.getParams().name} details={this.state.draftDetails} user={UserStore.getUserInfo().user} />
         <Rosters members={this.state.draftDetails.members} />
        <DraftBoard id={this.getParams().name} players={this.state.stats} user={UserStore.getUserInfo().user} />
      </div>

    );
  }

});

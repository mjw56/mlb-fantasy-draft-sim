let mongoose = require('mongoose');

let schema = new mongoose.Schema(
  {
     StatID: 'number',
     TeamID: 'number',
     PlayerID: 'number',
     SeasonType: 'number',
     Season: 'number',
     Name: 'string',
     Team: 'string',
     Position: 'string',
     PositionCategory: 'string',
     Updated: 'string',
     GameID: 'string',
     OpponentID: 'string',
     Opponent: 'string',
     Day: 'string',
     DateTime: 'string',
     HomeOrAway: 'string',
     IsGameOver: 'boolean',
     Games: 'number',
     Started: 'number',
     BattingOrder: 'string',
     FantasyPoints: 'number',
     FanDuelSalary: 'string',
     DraftKingsSalary: 'string',
     FantasyDataSalary: 'string',
     AtBats: 'number',
     Runs: 'number',
     Hits: 'number',
     Singles: 'number',
     Doubles: 'number',
     Triples: 'number',
     HomeRuns: 'number',
     RunsBattedIn: 'number',
     BattingAverage: 'number',
     Outs: 'number',
     Strikeouts: 'number',
     Walks: 'number',
     HitByPitch: 'number',
     Sacrifices: 'number',
     SacrificeFlies: 'number',
     GroundIntoDoublePlay: 'number',
     StolenBases: 'number',
     CaughtStealing: 'number',
     PitchesSeen: 'number',
     OnBasePercentage: 'number',
     SluggingPercentage: 'number',
     OnBasePlusSlugging: 'number',
     Errors: 'number',
     Wins: 'number',
     Losses: 'number',
     Saves: 'number',
     InningsPitchedDecimal: 'number',
     TotalOutsPitched: 'number',
     InningsPitchedFull: 'number',
     InningsPitchedOuts: 'number',
     EarnedRunAverage: 'number',
     PitchingHits: 'number',
     PitchingRuns: 'number',
     PitchingEarnedRuns: 'number',
     PitchingWalks: 'number',
     PitchingStrikeouts: 'number',
     PitchingHomeRuns: 'number',
     PitchesThrown: 'number',
     PitchesThrownStrikes: 'number',
     WalksHitsPerInningsPitched: 'number',
     PitchingBattingAverageAgainst: 'number'
  }
)

export default mongoose.model('PlayerStat', schema);

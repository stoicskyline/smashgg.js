"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema = __importStar(require("./schema"));
exports.streamQueue = `query StreamQueueQuery($tournamentId: ID!, $includePlayerStreams: Boolean){
	streamQueue(tournamentId:$tournamentId, includePlayerStreams:$includePlayerStreams){
		stream{
			${Schema.stream}
		}
		sets{
			${Schema.set}
		}
	}
}`;

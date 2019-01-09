import log from 'winston'
import request from 'request-promise'
import { format } from 'util'
import Cache from './util/Cache'
import Encoder from './util/Encoder'

/* Interfaces */
import { ICommon } from './interfaces/ICommon'
import { IVideoGame } from './interfaces/IVideoGame'

/* Types */
import TVideoGame = IVideoGame.VideoGame

/* Convenience */
import Data = IVideoGame.Data
import Entity = IVideoGame.Entity
import Options = ICommon.Options
import parseOptions = ICommon.parseOptions

const API_URL = 'https://api.smash.gg/public/videogames';
//const LEGAL_ENCODINGS = ['json', 'utf8', 'base64'];
//const DEFAULT_ENCODING = 'json';

export default class VideoGame implements IVideoGame.VideoGame{

	id: number = 0
	data: Entity | string = ''
	name: string
	abbrev: string
	displayName: string
	minPerEntry: number
	maxPerEntry: number
	approved: boolean
	slug: string 
	isCardGame: boolean
	rawEncoding: string = 'json'

	constructor(id: number, name: string, abbrev: string, displayName: string, minPerEntry: number, 
		maxPerEntry: number, approved: boolean, slug: string, isCardGame: boolean){
		
		this.id = id;
		this.name = name;
		this.abbrev = abbrev;
		this.displayName = displayName;
		this.minPerEntry = minPerEntry;
		this.maxPerEntry = maxPerEntry;
		this.approved = approved;
		this.slug = slug;
		this.isCardGame = isCardGame;
	}

	encode(data: Entity, encoding: string) : Entity | string{
		let encoded = encoding == 'json' ? data : new Buffer(JSON.stringify(data)).toString(encoding);
		this.data = encoded;
		return encoded;
	}

	decode(data: Entity, encoding: string) : Entity{
		let decoded = this.rawEncoding == 'json' ? data : JSON.parse(new Buffer(data.toString(), encoding).toString('utf8'));
		return decoded;
	}

	getId() : number | undefined{
		return this.id;
	}

	getName() : string | undefined{
		return this.name;
	}

	getAbbreviation() : string | undefined{
		return this.abbrev;
	}

	getDisplayName() : string | undefined{
		return this.displayName;
	}

	getMinPerEntry() : number | undefined{
		return this.minPerEntry;
	}

	getMaxPerEntry() : number | undefined{
		return this.maxPerEntry;
	}

	getApproved() : boolean | undefined{
		return this.approved;
	}

	getSlug() : string | undefined{
		return this.slug;
	}

	getIsCardGame() : boolean | undefined{
		return this.isCardGame;
	}

	static async getAll(options: Options={}) : Promise<Array<TVideoGame>>{
		log.debug('VideoGames getAll called');
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = 'videoGames::all';
			if(options.isCached){
				let cached: TVideoGame[] = await Cache.getInstance().get(cacheKey) as TVideoGame[];
				if(cached) return cached;
			}
			
			let data: Data = JSON.parse(await request(API_URL));
			let videoGames = data.entities.videogame.map(videoGame => {
				return new VideoGame(
					videoGame.id,
					videoGame.name,
					videoGame.abbrev,
					videoGame.displayName,
					videoGame.minPerEntry,
					videoGame.maxPerEntry,
					videoGame.approved,
					videoGame.slug,
					videoGame.isCardGame
				);
			});

			if(options.isCached) await Cache.getInstance().set(cacheKey, videoGames);
			return videoGames;
		} catch(e){
			log.error('VideoGames getAll error: %s', e);
			throw e;
		}
	}

	static async getById(id: number, options: Options={}) : Promise<TVideoGame> {
		log.debug('VideoGame getById called [%s]', id);
		try{
			// parse options
			options = parseOptions(options);

			let cacheKey = format('VideoGame::id::%s', id);
			if(options.isCached){
				let cached = await Cache.getInstance().get(cacheKey) as TVideoGame;
				if(cached) return cached;
			}

			let data = await VideoGame.getAll(options);
			let videoGames = data.filter(vg => { return vg.id === id; });
			if(videoGames.length <= 0) throw new Error('No video game with id ' + id);
			let videoGame = videoGames[0];

			if(options.isCached) Cache.getInstance().set(cacheKey, videoGame);
			return videoGame;
		} catch(e){
			log.error('VideoGame getById error: %s', e);
			throw e;
		}
	}

	static async getByName(name: string, options: Options={}) : Promise<TVideoGame> {
		log.debug('VideoGame getByName called [%s]', name);
		try{
			// parse options
			let isCached = options.isCached || true;

			let cacheKey = format('VideoGame::name::%s', name);
			if(isCached){
				let cached = await Cache.getInstance().get(cacheKey) as TVideoGame;
				if(cached) return cached;
			}

			let data = await VideoGame.getAll();
			let videoGames = data.filter(vg => {
				return vg.name === name || 
					vg.abbrev === name ||
					vg.slug === name ||
					vg.displayName === name;
			});
			if(videoGames.length <= 0) throw new Error('No video game with name ' + name);
			let videoGame = videoGames[0];

			if(isCached) Cache.getInstance().set(cacheKey, videoGame);
			return videoGame;
		} catch(e){
			log.error('VideoGame getByName error: %s', e);
			throw e;
		}
	}
}

module.exports = VideoGame;
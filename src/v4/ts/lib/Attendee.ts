/** aka Participant **/
import _ from 'lodash'
import Log from './util/Logger'
import {User} from './User' // TODO change to internal later
import { IPhase, Phase } from './Phase'
import { IPhaseGroup, PhaseGroup } from './PhaseGroup'
import * as queries from './scripts/attendeeQueries'
import NI from './util/NetworkInterface'

export class Attendee implements IAttendee.Attendee{
	id: number
	gamerTag: string
	prefix: string | null
	createdAt: number | null
	claimed: boolean | null
	verified: boolean | null
	playerId: number | null
	phoneNumber: number | null
	connectedAccounts: object | null
	contactInfo: IAttendee.ContactInfo | null
	eventIds: number[] | null

	constructor(
		id: number,
		gamerTag: string,
		prefix: string | null,
		createdAt: number | null,
		claimed: boolean | null,
		verified: boolean | null,
		playerId: number | null,
		phoneNumber: number | null,
		connectedAccounts: object | null,
		contactInfo: IAttendee.ContactInfo | null,
		eventIds: number[] | null
	){
		this.id = id
		this.gamerTag = gamerTag
		this.prefix = prefix
		this.createdAt = createdAt
		this.claimed = claimed
		this.verified = verified
		this.playerId = playerId
		this.phoneNumber = phoneNumber
		this.contactInfo = contactInfo
		this.connectedAccounts = connectedAccounts
		this.eventIds = eventIds
	}

	static parse(data: IAttendee.AttendeeData) : Attendee {
		let eventIds = data.events.map(event => event.id);
		
		return new Attendee(
			data.id,
			data.gamerTag,
			data.prefix,
			data.createdAt,
			data.claimed,
			data.verified,
			data.playerId,
			data.phoneNumber,
			data.connectedAccounts,
			data.contactInfo,
			eventIds
		)
	}
	
 	static parseFull(data: IAttendee.Data) : Attendee{
		return this.parse(data.participant);
	}

	static eq(a1: Attendee, a2: Attendee){
		return a1.gamerTag == a2.gamerTag && 
				a1.prefix == a2.prefix && 
				a1.playerId == a2.playerId;
	}

	getId(): number{
		return this.id
	}
	
	getGamerTag(): string{
		return this.gamerTag
	}
	
	getSponsor(): string | null{
		return this.prefix
	}
	
	getCreatedAt(): number | null{
		return this.createdAt
	}
	
	getClaimed(): boolean | null{
		return this.claimed
	}
	
	getVerified(): boolean | null{
		return this.verified
	}
	
	getPlayerId(): number | null{
		return this.playerId
	}
	
	getPhoneNumber(): number | null{
		return this.phoneNumber
	}
	
	getContactInfo(): IAttendee.ContactInfo | null {
		return this.contactInfo
	}

	getCity(): string | null{
		if(this.contactInfo)
			return this.contactInfo.city
		else return null
	}
	getState(): string | null{
		if(this.contactInfo)
			return this.contactInfo.state
		else return null
	}
	getStateId(): number | null{
		if(this.contactInfo)
			return this.contactInfo.stateId
		else return null
	}
	getCountry(): string | null{
		if(this.contactInfo)
			return this.contactInfo.country
		else return null
	}
	getCountryId(): number | null{
		if(this.contactInfo)
			return this.contactInfo.countryId
		else return null
	}
	getContactName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.name
		else return null
	}
	getFirstName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.nameFirst
		else return null
	}
	getLastName(): string | null{
		if(this.contactInfo)
			return this.contactInfo.nameLast
		else return null
	}
	getZipcode(): string | null{
		if(this.contactInfo)
			return this.contactInfo.zipcode
		else return null
	}
	
	getConnectedAccounts(): object | null{
		return this.connectedAccounts
	}

	/* TODO implement
	async getEvents() : Promise<Event[]> {
		Log.info('Getting Events that Attendee %s (Participant %s) entered', this.gamerTag, this.id);
		return Event.getByIds();
	}
	*/

	async getUserAccount() : Promise<User> {
		Log.info('Getting User account that Attendee %s (Participant %s) entered', this.gamerTag, this.id!)
		return await User.getById(this.playerId!)
	}

	async getEnteredPhases() : Promise<Phase[]> {
		Log.info('Getting Phases that Attendee %s (Participant %s) entered', this.gamerTag, this.id)
		const data: IAttendee.AttendeeWithPhasesData = await NI.query(queries.getAttendeePhases, {id: this.id})
		const seedData = _.flatten(data.participant.entrants.map(entrant => entrant.seeds))
		const phaseData: IPhase.PhaseData[] = _.flatten(seedData.map(seed => seed.phase))
		const phases: Phase[] = phaseData.map(data => Phase.parse(data))
		return phases;
	}

	async getEnteredPhaseGroups() : Promise<PhaseGroup[]> {
		Log.info('Getting Phase Groups that Attendee %s (Participant %s) entered', this.gamerTag, this.id)
		const data: IAttendee.AttendeeWithPhaseGroupsData = await NI.query(queries.getAttendeePhaseGroups, {id: this.id})
		const seedData = _.flatten(data.participant.entrants.map(entrant => entrant.seeds))
		const groupData: IPhaseGroup.PhaseGroupData[] = _.flatten(seedData.map(seed => seed.phaseGroup))
		const groups: PhaseGroup[] = groupData.map(data => PhaseGroup.parse(data))
		return groups;
	}
}

export namespace IAttendee{
	export interface Attendee{
		id: number
		gamerTag: string,
		prefix: string | null
		createdAt: number | null
		claimed: boolean | null
		verified: boolean | null
		playerId: number | null
		phoneNumber: number | null
		contactInfo: ContactInfo | null
		connectedAccounts: object | null
		
		getId(): number
		getGamerTag(): string
		getSponsor(): string | null
		getCreatedAt(): number | null
		getClaimed(): boolean | null
		getVerified(): boolean | null
		getPlayerId(): number | null
		getPhoneNumber(): number | null
		getContactInfo(): ContactInfo | null
		getCity(): string | null
		getState(): string | null
		getStateId(): number | null
		getCountry(): string | null
		getCountryId(): number | null
		getContactName(): string | null
		getFirstName(): string | null
		getLastName(): string | null
		getZipcode(): string | null
		getConnectedAccounts(): object | null

		//getEvents() : Promise<Event[]>
		getUserAccount() : Promise<User>
		getEnteredPhases() : Promise<Phase[]>
		getEnteredPhaseGroups() : Promise<PhaseGroup[]>

	}

	export interface Data{
		"participant": AttendeeData
	}

	export interface AttendeeData{
		id: number
		gamerTag: string,
		prefix: string | null
		createdAt: number | null
		claimed: boolean | null
		verified: boolean | null
		playerId: number | null
		phoneNumber: number | null
		contactInfo: ContactInfo | null
		connectedAccounts: object | null
		events: {
			id: number
		}[]
	}

	export interface AttendeeWithPhasesData{
		participant:{
			entrants: {
				seeds : {
					id: string
					phase: IPhase.PhaseData[]
				}[]
			}[]
		}
	} 

	export interface AttendeeWithPhaseGroupsData{
		participant:{
			entrants: {
				seeds : {
					id: string
					phaseGroup: IPhaseGroup.PhaseGroupData[]
				}[]
			}[]
		}
	}

	export interface ConnectedAccount{ }

	export interface ContactInfo{
		id: string | null,
		city: string | null,
		state: string | null,
		stateId: number | null,
		country: string | null,
		countryId: number | null,
		name: string | null,
		nameFirst: string | null,
		nameLast: string | null,
		zipcode: string | null
	}

	export interface AttendeeOptions{
		areSeedsPublished?: boolean,
		isVerified?: boolean,
		page?: number | null,
		perPage?: number | null,
		sortBy?: string | null,
		filter?: null | {
			id?: number,
			entrantName?: string,
			checkInState?: number,
			phaseGroupId?: number[],
			phaseId?: number[],
			eventId?: number,
			seach?:{
				fieldsToSearch: string[],
				searchString: string
			}
		}
	}

	export function getDefaultAttendeeOptions() : AttendeeOptions{
		return {
			areSeedsPublished: true,
			page: 1,
			perPage: 1,
			sortBy: null,
			filter: null
		}
	}
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ROOT = path_1.default.join(__dirname, '..', '..', '..', '..', '.env');
const dotenv_1 = require("dotenv");
dotenv_1.config({ path: ROOT });
require("../lib/util/ErrorHandler");
const chai_1 = require("chai");
const User_1 = require("../lib/User");
const Initializer_1 = __importDefault(require("../lib/util/Initializer"));
const testData = __importStar(require("./data/user.testData"));
let user1, user2, user3;
const USER_ID_1 = 159429; // Davemon
const USER_ID_2 = 34475; // Mike G
const USER_ID_3 = 7802; // j00t
const DAVEMON_RANKINGS = [
    {
        "id": 294398,
        "title": "Tennessee: Spring 2018",
        "rank": 2
    },
    {
        "id": 317143,
        "title": "Tennessee: Fall 2018",
        "rank": 2
    }
];
describe('smashgg User', function () {
    before(async function () {
        this.timeout(15000);
        await Initializer_1.default(process.env.API_TOKEN);
        user1 = await User_1.User.getById(USER_ID_1);
        user2 = await User_1.User.getById(USER_ID_2);
        user3 = await User_1.User.getById(USER_ID_3);
        return true;
    });
    // equality
    it('should be the expected User object', function () {
        chai_1.expect(user1).to.deep.equal(User_1.User.parse(testData.user1));
    });
    it('should be the expected User object', function () {
        chai_1.expect(user2).to.deep.equal(User_1.User.parse(testData.user2));
    });
    it('should be the expected User object', function () {
        chai_1.expect(user3).to.deep.equal(User_1.User.parse(testData.user3));
    });
    // id
    it('should get the correct id 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getId()).to.be.equal(USER_ID_1);
    });
    it('should get the correct id 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getId()).to.be.equal(USER_ID_2);
    });
    it('should get the correct id 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getId()).to.be.equal(USER_ID_3);
    });
    // gamertag
    it('should get the correct gamer tag 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getGamerTag()).to.be.equal('Davemon');
    });
    it('should get the correct gamer tag 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getGamerTag()).to.be.equal('Mike G');
    });
    it('should get the correct gamer tag 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getGamerTag()).to.be.equal('j00t');
    });
    // prefix
    it('should get the correct sponsor 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getSponsor()).to.be.equal('eski');
    });
    it('should get the correct sponsor 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getSponsor()).to.be.equal('');
    });
    it('should get the correct sponsor 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getSponsor()).to.be.null;
    });
    // color
    it('should get the correct color 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getColor()).to.be.equal('#7185AD');
    });
    it('should get the correct color 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getColor()).to.be.null;
    });
    it('should get the correct color 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getColor()).to.be.null;
    });
    // twitch stream
    it('should get the correct twitch stream 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getTwitchStream()).to.be.equal('xdavemon');
    });
    it('should get the correct twitch stream 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getTwitchStream()).to.be.equal('mikegz');
    });
    it('should get the correct twitch stream 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getTwitchStream()).to.be.null;
    });
    // twitter handle
    it('should get the correct twitter handle 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getTwitterHandle()).to.be.equal('Davemonlol');
    });
    it('should get the correct twitter handle 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getTwitterHandle()).to.be.equal('xMikeGeezy');
    });
    it('should get the correct twitter handle 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getTwitterHandle()).to.be.null;
    });
    // youtube
    it('should get the correct youtube 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getYoutube()).to.be.null;
    });
    it('should get the correct youtube 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getYoutube()).to.be.null;
    });
    it('should get the correct youtube 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getYoutube()).to.be.null;
    });
    // region 
    it('should get the correct region 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getRegion()).to.be.null;
    });
    it('should get the correct region 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getRegion()).to.be.null;
    });
    it('should get the correct region 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getRegion()).to.be.null;
    });
    // state 
    it('should get the correct state 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getState()).to.be.equal('TN');
    });
    it('should get the correct state 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getState()).to.be.equal('GA');
    });
    it('should get the correct state 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getState()).to.be.equal('AL');
    });
    // gamer tag last changed 
    it('should get the correct gamer tag changed at 1', function () {
        this.timeout(5000);
        chai_1.expect(user1.getGamerTagChangedAt()).to.be.null;
    });
    it('should get the correct gamer tag changed at 2', function () {
        this.timeout(5000);
        chai_1.expect(user2.getGamerTagChangedAt()).to.be.null;
    });
    it('should get the correct gamer tag changed at 3', function () {
        this.timeout(5000);
        chai_1.expect(user3.getGamerTagChangedAt()).to.be.null;
    });
    // rankings
    it('should get the correct rankings back 1', async function () {
        this.timeout(5000);
        chai_1.expect(await user1.getRankings()).to.have.deep.members(DAVEMON_RANKINGS);
        return true;
    });
    it('should get the correct rankings back 2', async function () {
        this.timeout(5000);
        chai_1.expect(await user2.getRankings()).to.be.null;
        return true;
    });
    it('should get the correct rankings back 3', async function () {
        this.timeout(5000);
        chai_1.expect(await user3.getRankings()).to.be.null;
        return true;
    });
    // TODO implement
    // recent sets
    xit('should get the correct recent sets back 1', async function () {
        this.timeout(5000);
    });
    xit('should get the correct recent sets back 2', async function () {
        this.timeout(5000);
    });
    xit('should get the correct recent sets back 3', async function () {
        this.timeout(5000);
    });
});

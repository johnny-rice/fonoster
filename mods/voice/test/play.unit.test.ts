/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import PlayVerb from "../src/play/play";
import VoiceEvents from "../src/events";
import {Verb} from "../src/verb";
import {voiceRequest} from "./voice_request";
const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
const sandbox = sinon.createSandbox();

describe("@fonos/voice/play", () => {
  afterEach(() => sandbox.restore());

  it("play a sound on a remote media server", (done) => {
    sandbox.stub(Verb.prototype, "post").returns();
    const voiceEvents = new VoiceEvents();
    const play = new PlayVerb(voiceRequest, voiceEvents);
    play
      .run("sounds:hello-world", {})
      .then((event) => {
        expect(event).to.be.deep.equal({type: "PlaybackFinished", data: "1"});
        done();
      })
      .catch((e) => done(e));

    setTimeout(() => {
      voiceEvents.broadcast(
        JSON.stringify({type: "PlaybackFinished", data: "1"})
      );
    }, 500);
  });
});

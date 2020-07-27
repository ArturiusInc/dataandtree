export default class PC {
	constructor() {
		this.configuration = { iceServers: [{ urls: ["stun:stun4.l.google.com:19302"] }] };
		this.peerConnection = new RTCPeerConnection(this.configuration);
		this.dataChannel = this.peerConnection.createDataChannel("messaging-channel", { ordered: true });
		console.log("init");
	}

	call() {
		this.peerConnection.addEventListener("icecandidate", this.sendCandidate);
		this.peerConnection.addEventListener("open", () => {
			console.log("Local channel open!");
		});
		console.log("call");
	}

	async createOffer() {
		const localOffer = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(localOffer);
		console.log("localOffer");
		return localOffer;
	}

	async createAnswer() {
		const localAnswer = await this.peerConnection.createAnswer();
		await this.peerConnection.setLocalDescription(localAnswer);
		console.log("localAnswer");
		return localAnswer;
	}

	set remoteDesc(remoteAnswer) {
		this.peerConnection.setRemoteDescription(remoteAnswer);
		console.log("setRemoteDescription");
	}

	async sendCandidate(e) {
		if (e.candidate) {
			console.log("sendCandidate", e.candidate);
			// send from websocket e.candidate
		}
	}

	async addCandidate(icecandidate) {
		await this.peerConnection.addIceCandidate(icecandidate);
		console.log("addIceCandidate");
	}

	send(message) {
		this.dataChannel.send(message);
	}
}

const axios = require("axios");

module.exports = {
    name: "profile",
    description: "📱 View user profile with style",
    prefixRequired: true,
    adminOnly: false,
    async execute(api, event, args) {
        const { threadID, messageID, senderID } = event;
        const targetID = Object.keys(event.mentions)[0] || senderID;

        try {
            const userInfo = await api.getUserInfo(targetID);
            const threadInfo = await api.getThreadInfo(threadID);
            const user = userInfo[targetID];

            const msg = `╔═══ 《 User Profile 》 ═══╗\n` +
                       `║ 👤 Name: ${user.name}\n` +
                       `║ 🆔 UID: ${targetID}\n` +
                       `║ 👥 Gender: ${user.gender === 1 ? "Female" : user.gender === 2 ? "Male" : "Other"}\n` +
                       `║ 🌟 Profile URL: ${user.profileUrl}\n` +
                       `║\n` +
                       `║ 💭 Current Group:\n` +
                       `║ 📢 ${threadInfo.threadName}\n` +
                       `║ 👥 Members: ${threadInfo.participantIDs.length}\n` +
                       `╚════════════════════════╝`;

            const imgPath = "./cache/profile.jpg";
            const profilePic = await axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=EAAD`, { responseType: "arraybuffer" });
            fs.writeFileSync(imgPath, Buffer.from(profilePic.data));

            await api.sendMessage({
                body: msg,
                attachment: fs.createReadStream(imgPath)
            }, threadID, messageID);

            fs.unlinkSync(imgPath);
        } catch (error) {
            await api.sendMessage("❌ Unable to fetch profile information!", threadID, messageID);
        }
    }
};

const ldap = require("ldapjs");
const config = require("./config.json");

/**
 *
 * @param dn
 * @param client
 * @param username
 */
function searchUser(client, username) {
  return new Promise((resolve, reject) => {
    client.search(
      config.ldap.baseDN,
      {
        filter: "(uid=" + username + ")",
        scope: "sub",
        attributes: ["cn", "sn", "mail", "displayName", "uid"],
      },
      (err, res) => {
        res.on("searchEntry", (entry) => {
          let b = {};
          for (let a of entry.pojo.attributes) {
            b[a.type] = a.values[0];
          }

          resolve(b);
        });
        res.on("error", (err) => {
          reject(err);
        });
      },
    );
  });
}

module.exports = (username, password) => {
  return new Promise((resolve, reject) => {
    if(!username.match(/^[a-z0-9A-Z\-]+$/)) {
      reject("Invalid username");
      return;
    }
    const client = ldap.createClient({
      url: config.ldap.url,
    });

    client.bind(config.ldap.bindDN.replace("%u", username), password, (err) => {
      if (err) {
        console.log("In error If");
        reject(err);
        return;
      }
      searchUser(client, username).then((user) => {
        resolve(user);
      });
    });
  });
};


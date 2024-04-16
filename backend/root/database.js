import mysql from "mysql2";
import dotenv from "dotenv";



dotenv.config();



const database_pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DB
}).promise();



export async function createAccount (username, first_name, last_name, password, email, phone_number, profile_picture) {
    const username_exists = await checkIfUsernameExists(username);
    phone_number = phone_number.toString();
    if (username_exists) {
        console.warn("This username is already in use!")
        return "This username is already in use!";
    }  else if (username == "" ||first_name == "" || last_name == "" || password == "" || email == "" || phone_number.length != 10) {
        console.warn("You have to fill in valid data!")
        return "You have to fill in valid data!";
    } else {
        if (profile_picture == "") {
            let random = Math.floor(Math.random() * 5 + 1);
            random = random.toString();
            profile_picture = "/images/users/standart_" + random + ".jpg"
        };
        const query_p1 = "insert into `my_database`.`users` (`username`, `first_name`, `last_name`, `password`, `email`, `phone_number`, `account_created`, `account_permissions`, `profile_picture`) values ";
        const date = new Date().toISOString().split('T')[0];
        const time = Date().slice(16, 24);
        const sorted_date = date + " " + time;
        const query_p2 = "(?, ?, ?, ?, ?, ?, '" + sorted_date + "', ?, ?);";
        const query = query_p1 + query_p2;
        await database_pool.query(query, [username, first_name, last_name, password, email, phone_number, "user", profile_picture]);
        return "Account created";
    };
};

export async function getAccount (username) {
    const query = "select * from `my_database`.`users` where (`username` = ?);";
    const [result] = await database_pool.query(query, [username]);
    return result;
};

export async function getUsername (email) {
    const query = "select * from my_database.users where (email = ?);";
    const [result] = await database_pool.query(query, [email]);
    return result;
};

export async function getUsernameWithId (id) {
    id = id.toString()
    const query = "select * from my_database.users where (id = ?);";
    const [result] = await database_pool.query(query, [id]);
    return result;
};

export async function validateLogin (username, password) {
    const username_exists = await checkIfUsernameExists(username);
    if (!username_exists) {
        return "Username or E-Mail does not exist!";
    } else {
        const query = "select * from `my_database`.`users` where (`username` = ?);";
        const query2 = "select * from my_database.users where (email = ?);";
        const [result] = await database_pool.query(query, [username]);
        const [result2] = await database_pool.query(query2, [username]);
        if (result[0] != undefined) {
            if (result[0].password == password) {
                return "Successfully logged in with username!";
            } else {
                return "Wrong Password!";
            };
        } else {
            if (result2[0].password == password) {
                return "Successfully logged in with email!";
            } else {
                return "Wrong Password!";
            };
        };
    };
};

export async function editCredentials (username, first_name, last_name, password, email, phone_number, profile_picture, this_username) {
    let query;
    let id = await getAccount(this_username);
    id = id[0].id;
    id = id.toString();
    phone_number = phone_number.toString();
    if (username != "") {
        query = "update `my_database`.`users` set `username` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [username]);
    };
    if (first_name != "") {
        query = "update `my_database`.`users` set `first_name` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [first_name]);
    };
    if (last_name != "") {
        query = "update `my_database`.`users` set `last_name` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [last_name]);
    };
    if (password != "") {
        query = "update `my_database`.`users` set `password` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [password]);
    };
    if (email != "") {
        query = "update `my_database`.`users` set `email` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [email]);
    };
    if (phone_number != "") {
        query = "update `my_database`.`users` set `phone_number` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [phone_number]);
    };
    if (profile_picture != "") {
        query = "update `my_database`.`users` set `profile_picture` = ? where (`id` = '" + id + "');";
        await database_pool.query(query, [profile_picture]);
    };

    return "Changed!";
};

export async function editProfilePicture (username, img) {
    if (img == "") {
        let random = Math.floor(Math.random() * 5 + 1);
        random = random.toString();
        img = "/images/users/standart_" + random + ".jpg"
    };
    const query = "update my_database.users set profile_picture = ? where (username = ?);";
    await database_pool.query(query, [img, username]);
    return "Changed!";
};




export async function deleteAccount (old_username, ip, feedback) {
    const query1 = "insert into `my_database`.`deleted_users` (`username`, `ip`, `date`, `feedback`) VALUES (?, ?, ?, ?);";
    const date = new Date().toISOString().split('T')[0];
    const time = Date().slice(16, 24);
    const sorted_date = date + " " + time;
    await database_pool.query(query1, [old_username, ip, sorted_date, feedback]);

    const query2 = "delete from `my_database`.`users` where (`username` = ?);";
    await database_pool.query(query2, [old_username]);
    return "Account deleted!";
};



async function checkIfUsernameExists (username) {
    const query = "select count(*) from my_database.users where (username = ?);";
    const query2 = "select count(*) from my_database.users where (email = ?);";
    const [result] = await database_pool.query(query, [username]);
    const [result2] = await database_pool.query(query2, [username]);
    if (result[0]["count(*)"] > 0 || result2[0]["count(*)"] > 0) {
        return true;
    } else {
        return false;
    };
};



export async function getProfilePicture (username) {
    const [account] = await getAccount(username);
    return account.profile_picture;
};



export async function getAllUsers () {
    const [result] = await database_pool.query("select username, profile_picture from my_database.users;");
    return result;
};
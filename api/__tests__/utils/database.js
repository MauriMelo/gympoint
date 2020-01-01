import database from '../../src/database';

export async function dropMongoDatabase() {
  const mongo = await database.mongooseConnection;
  await mongo.connection.db.dropDatabase();
}

export async function truncateSequelize() {
  return Promise.all(
    Object.keys(database.connection.models).map(key => {
      return database.connection.models[key].destroy({
        truncate: true,
        force: true,
      });
    })
  );
}

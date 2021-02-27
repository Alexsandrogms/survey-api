import { join } from 'path';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const databaseTestPath = join(
    './',
    'src',
    'database',
    'database.test.sqlite'
  );

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? databaseTestPath
          : defaultOptions.database,
    })
  );
};

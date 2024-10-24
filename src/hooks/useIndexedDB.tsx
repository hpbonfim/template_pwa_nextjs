"use client";
import { useCallback, useEffect, useRef } from "react";

import { openDB, type IDBPDatabase, type DBSchema } from "idb";

import { DATABASE } from "@/constants";

export interface IDBDataItem {
  id: string;
}

interface CustomDBSchema extends DBSchema {
  [storeName: string]: {
    key: string;
    value: IDBDataItem;
  };
}

export const useIndexedDB = <T extends IDBDataItem>(storeName: string) => {
  const dbRef = useRef<IDBPDatabase<CustomDBSchema> | null>(null);

  const dispatchDatabaseChangeEvent = useCallback(() => {
    const event = new CustomEvent(DATABASE.IDB_EVENT_KEY, {
      detail: { storeName }
    });
    window.dispatchEvent(event);
  }, [storeName]);

  useEffect(() => {
    if (!storeName) {
      console.error("storeName is required for useIndexedDB hook");
      return;
    }

    const initDB = async () => {
      try {
        const database = await openDB<CustomDBSchema>(
          DATABASE.IDB_NAME,
          DATABASE.IDB_VERSION,
          {
            upgrade(db) {
              if (!db.objectStoreNames.contains(storeName as never)) {
                db.createObjectStore(storeName as never, {
                  keyPath: DATABASE.IDB_KEY_PATH
                });
              }
            }
          }
        );
        dbRef.current = database;
      } catch (error) {
        console.error(
          `Error initializing IndexedDB (${DATABASE.IDB_NAME}):`,
          error
        );
      }
    };

    initDB();

    return () => {
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
    };
  }, [storeName]);

  const ensureConnection = useCallback(async (): Promise<
    IDBPDatabase<CustomDBSchema>
  > => {
    if (!dbRef.current || dbRef.current.onclose) {
      const database = await openDB<CustomDBSchema>(
        DATABASE.IDB_NAME,
        DATABASE.IDB_VERSION
      );
      dbRef.current = database;
    }
    return dbRef.current;
  }, []);

  const retryOperation = useCallback(
    async (
      operation: () => Promise<unknown>,
      retries = DATABASE.IDB_MAX_RETRIES as number
    ): Promise<unknown> => {
      try {
        return await operation();
      } catch (error) {
        if (
          retries > 0 &&
          error instanceof Error &&
          error.name === "InvalidStateError"
        ) {
          await new Promise((resolve) =>
            setTimeout(resolve, DATABASE.IDB_RETRY_DELAY)
          );
          return retryOperation(operation, retries - 1);
        }
        throw error;
      }
    },
    []
  );

  const saveItem = useCallback(
    async (item: T): Promise<void> => {
      await retryOperation(async () => {
        const database = await ensureConnection();
        await database.put(storeName as never, item);
        dispatchDatabaseChangeEvent();
      });
    },
    [ensureConnection, retryOperation, storeName, dispatchDatabaseChangeEvent]
  );

  const getItem = useCallback(
    async (id: string): Promise<T | undefined> => {
      return retryOperation(async () => {
        const database = await ensureConnection();
        return (await database.get(storeName as never, id)) as T | undefined;
      }) as Promise<T | undefined>;
    },
    [ensureConnection, retryOperation, storeName]
  );

  const getAllItems = useCallback(async (): Promise<T[]> => {
    return retryOperation(async () => {
      const database = await ensureConnection();
      return await database.getAll(storeName as never);
    }) as Promise<T[]>;
  }, [ensureConnection, retryOperation, storeName]);

  const updateItem = useCallback(
    async (id: string, updateData: Partial<T>): Promise<void> => {
      await retryOperation(async () => {
        const database = await ensureConnection();
        const item = await database.get(storeName as never, id);
        if (item) {
          const updatedItem = { ...item, ...updateData, timestamp: Date.now() };
          await database.put(storeName as never, updatedItem);
          dispatchDatabaseChangeEvent();
        }
      });
    },
    [ensureConnection, retryOperation, storeName, dispatchDatabaseChangeEvent]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      await retryOperation(async () => {
        const database = await ensureConnection();
        await database.delete(storeName as never, id);
        dispatchDatabaseChangeEvent();
      });
    },
    [ensureConnection, retryOperation, storeName, dispatchDatabaseChangeEvent]
  );

  return { saveItem, getItem, getAllItems, updateItem, deleteItem };
};

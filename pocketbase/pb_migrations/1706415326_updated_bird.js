/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner_id.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = ""

  return dao.saveCollection(collection)
})

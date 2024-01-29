/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner.id || @request.auth.id ?= editors"
  collection.viewRule = "@request.auth.id = owner.id || @request.auth.id ?= editors"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner.id"
  collection.viewRule = "@request.auth.id = owner.id"

  return dao.saveCollection(collection)
})

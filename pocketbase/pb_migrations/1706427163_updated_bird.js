/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner.id \n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id"
  collection.viewRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id"
  collection.updateRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id"
  collection.deleteRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner.id \n|| @request.auth.id ?= editors\n|| @request.auth.id ?= viewers"
  collection.viewRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors\n|| @request.auth.id ?= viewers"
  collection.updateRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors"
  collection.deleteRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors"

  return dao.saveCollection(collection)
})

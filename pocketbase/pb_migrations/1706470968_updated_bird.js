/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id != \"\"\n&& (\n@request.auth.id = owner.id \n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.viewers.id)\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)\n)"
  collection.viewRule = "@request.auth.id != \"\"\n&& (\n@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.viewers.id)\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)\n)"
  collection.updateRule = "@request.auth.id != \"\"\n&& (\n@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)\n)"
  collection.deleteRule = "@request.auth.id != \"\"\n&& (\n@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qpqvix8u66p7yco")

  collection.listRule = "@request.auth.id = owner.id \n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.viewers.id)\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)"
  collection.viewRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| @request.auth.id ?= viewers.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.viewers.id)\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)"
  collection.updateRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)"
  collection.deleteRule = "@request.auth.id = owner.id\n|| @request.auth.id ?= editors.id\n|| (owner.id = @collection.account_sharing.owner.id\n    && @request.auth.id = @collection.account_sharing.editors.id)"

  return dao.saveCollection(collection)
})

const models = require("../../db/models")

async function listCategories(req, res) {
  res.send(await models.Category.findAll())
}

async function listSites(req, res) {
  res.send(await models.Site.findAll())
}

async function listCategorySites(req, res) {
  let category = await models.Category.findByPk(req.params.id, { include: { model: models.Site, as: 'sites'  } })
  if (category)
    res.send(category.sites)
  else
    res.sendStatus(404)
}

async function getSite(req, res) {
  let site = await models.Site.findByPk(req.params.id)
  if (site)
    res.send(site)
  else
    res.sendStatus(404)
}

async function addNewSite(req, res) {
  let result = await models.Site.build(req.body)
  result.categoryId = req.params.id
  await result.save()
  res.send(result)
}

async function addNewCategory(req, res) {
  let result = await models.Category.build(req.body)
  await result.save()
  res.send(result)
}

async function delSite(req, res) {
  let site = await models.Site.findByPk(req.params.id)
  if (!site)
    res.sendStatus(404)

  await site.destroy()
  res.sendStatus(200)
}

async function delCategory(req, res) {
  let category = await models.Category.findByPk(req.params.id)

  if (!category)
    res.sendStatus(404)

  await category.destroy()
  res.sendStatus(200)
}

async function updateSite(req, res) {
  // let site = await models.Site.findByPk(req.params.id)
  let site = {}
  site.name = req.body.name
  site.url = req.body.url
  site.user = req.body.user
  site.password = req.body.password
  site.description = req.body.description

  await models.Site.update(site, { where: { id: req.params.id }})
  res.sendStatus(200)
}

function init(app) {
  app.get('/categories/:id', listCategorySites)
  app.get('/categories',listCategories)
  app.get('/sites',listSites)
  app.get('/sites/:id', getSite)

  app.post('/categories/:id', addNewSite)
  app.post('/categories', addNewCategory)

  app.delete('/sites/:id', delSite)
  app.delete('/categories/:id', delCategory)

  app.put('/sites/:id', updateSite)
}

module.exports = {
  init
}
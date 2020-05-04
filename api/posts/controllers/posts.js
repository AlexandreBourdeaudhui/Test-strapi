"use strict";

/*
 * Package Import
 */
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  /**
   * Create a record.
   * @param  {Object}  context
   * @return {Object}
   */
  async create(context) {
    let entity;

    if (context.is("multipart")) {
      const { data, files } = parseMultipartData(context);
      data.author = context.state.user.id;
      entity = await strapi.services.posts.create(data, { files });
    }
    else {
      context.request.body.author = context.state.user.id;
      entity = await strapi.services.posts.create(context.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.posts });
  },

  /**
   * Retrieve records.
   * @param  {Object}  context
   * @return {Array}
   */
  async find(context) {
    let entities;

    context.query = {
      ...context.query,
      status: "published"
    };

    if (context.query._q) {
      entities = await strapi.services.posts.search(context.query);
    }
    else {
      entities = await strapi.services.posts.find(context.query);
    }

    return entities.map(entity =>
      sanitizeEntity(entity, { model: strapi.models.posts })
    );
  },

  /**
   * Retrieve a record.
   * @param  {Object}  context
   * @return {Object}
   */
  async findOne(context) {
    const entity = await strapi.services.posts.findOne({
      id: context.params.id,
      status: "published" // @TODO ne fonctionne pas.
    });

    return sanitizeEntity(entity, { model: strapi.models.posts });
  }
};

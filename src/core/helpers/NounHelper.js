const pluralize = require("pluralize");

module.exports = class NounHelper {
  /**
   * @description given a resource, convert to its' plural name
   * @example blog_posts returns BlogPosts
   * @param {*} val the resource
   */
  static fromResourcePluralToNamePlural(val) {
    const plural = this.getPluralForm(val);
    return plural
      .split("_")
      .map(word => word[0].toUpperCase() + word.substring(1))
      .join("");
  }

  /**
   * @description given a noun, convert to its' plural form
   * @example BlogPost returns BlogPosts
   * @param {*} val the noun
   */
  static getPluralForm(val) {
    return pluralize.plural(val);
  }

  /**
   * @description given a noun, convert to its' singular form
   * @example BlogPosts returns BlogPost
   * @param {*} val the noun
   */
  static getSingularForm(val) {
    return pluralize.singular(val);
  }

  /**
   * @description given a noun, convert to its' singular "resource" form
   * @example BlogPosts returns blog_post
   * @param {*} val the noun
   */
  static toSingularResource(val) {
    const singular = this.getSingularForm(val);

    return singular.split("").reduce((acc, curr, idx) => {
      if (curr === curr.toUpperCase() && idx !== 0) {
        acc += `_${curr.toLowerCase()}`;
      } else if (idx === 0) {
        acc += curr.toLowerCase();
      } else {
        acc += curr;
      }

      return acc;
    }, "");
  }

  /**
   * @description given a noun, convert to its' plural "resource" form
   * @example BlogPost returns blog_posts
   * @param {*} val the noun
   */
  static toPluralResource(val) {
    const plural = this.getPluralForm(val);

    return plural.split("").reduce((acc, curr, idx) => {
      if (curr === curr.toUpperCase() && idx !== 0) {
        acc += `_${curr.toLowerCase()}`;
      } else if (idx === 0) {
        acc += curr.toLowerCase();
      } else {
        acc += curr;
      }

      return acc;
    }, "");
  }
};

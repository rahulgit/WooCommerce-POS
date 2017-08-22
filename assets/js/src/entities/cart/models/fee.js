var Model = require('./abstract');
var polyglot = require('lib/utilities/polyglot');
var Radio = require('backbone.radio');
var _ = require('lodash');

module.exports = Model.extend({

  type: 'fee',

  defaults: function(){
    var fee = Radio.request('entities', 'get', {
      type: 'option',
      name: 'fee'
    });
    return {
      id            : null,
      name          : _.get( fee, 'name', polyglot.t('titles.fee') ),
      tax_status    : _.get( fee, 'tax_status', 'taxable' ),
      tax_class     : _.get( fee, 'tax_class', '' ),
      price         : _.get( fee, 'price', 0 )
    };
  },

  initialize: function(attributes, options){
    if(attributes && !attributes.price){
      this.set('price', _.get(attributes, 'total')); // convert order fee_line to price
    }
    Model.prototype.initialize.call( this, attributes, options );
  },

  /**
   * Return total and total_tax for subtotal and subtotal_tax, respectively
   * - a little confusing, but makes cart.sum('subtotal') easier
   */
  get: function( attr ){
    if( attr === 'subtotal' ){
      attr = 'total';
    }
    if( attr === 'subtotal_tax' ){
      attr = 'total_tax';
    }
    return Model.prototype.get.call(this, attr);
  },

  /**
   *
   */
  toJSON: function( options ) {
    var fee_line = Model.prototype.toJSON.call(this, options );
    fee_line.taxes = this.taxes.toJSON();
    return fee_line;
  }

});
var _ = require('lodash');

var QUEUE_LENGTH = 100;
var QUEUE_REFILL_THRESHOLD = 20;
var QUEUE_TIMEOUT_MS = 15000;

/**
 * Color class
 * @constructor
 */
function Color(){

    this.id = _.uniqueId('c');
    this.fetched = false;
    this.used = false;

    this.rgb = [
        Math.round(Math.random()*255),
        Math.round(Math.random()*255),
        Math.round(Math.random()*255)
    ];

}

/**
 * Marks color as fetched, returns id and rgb values,
 *  and unmarks as fetched after QUEUE_TIMEOUT_MS
 * @returns {{id: *, rgb: Array}}
 */
Color.prototype.fetch = function(){
    var me = this;
    log(me.id + ' fetched for QUEUE_TIMEOUT_MS ' + QUEUE_TIMEOUT_MS);
    me.fetched = true;
    me.timeout = setTimeout(function(){
        log('    ' + me.id + ' unfetched');
        me.fetched = false;
    }, QUEUE_TIMEOUT_MS);
    return {id: me.id, rgb: me.rgb};
};

/**
 * Marks color as used, to be removed upon next refillColors()
 */
Color.prototype.use = function(){
    log(this.id + ' used');
    clearTimeout(this.timeout);
    this.used = true;
};


/**
 * Queue class
 * @constructor
 */
function Queue(){
    this.colors = [];
    this.refillColors();
}

/**
 * Refills the color array with random colors only if
 *  the array length is below QUEUE_REFILL_THRESHOLD
 */
Queue.prototype.refillColors = function(){

    //Remove used colors
    this.colors = _.reject(this.colors, {used: true});

    //Refill if it's low
    var fetchedColors = _.filter(this.colors, {fetched: false, used: false});
    if(fetchedColors.length < QUEUE_REFILL_THRESHOLD){
        var refill = (QUEUE_LENGTH - fetchedColors.length);
        for(var i = 0, j = refill; i < j; i++){
            this.colors.push(new Color());
        }
    }

};

/**
 * Returns a random, unfetched, unused color
 */
Queue.prototype.fetchColor = function(){

    //Refill
    this.refillColors();

    //Get a random, unfetched, unused color
    var color = _(this.colors)
                    .chain()
                    .filter({fetched: false, used: false})
                    .shuffle()
                    .value().pop();

    //Make fetch happen
    return color.fetch();

};

/**
 * Sets the currentColor property for a duration of QUEUE_TIMEOUT_MS
 * @param colorId
 */
Queue.prototype.setColor = function(colorId){

    //Get this color
    var color = _.find(this.colors, {id: colorId});

    //Mark it `used`
    color.use();

};

module.exports = new Queue();
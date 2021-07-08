const mediaModel = require('../../models/media.model')
const paginationUtil = require('../../utils/pagination.util')
const utils = require('../../utils/misc.util')

/**
 * GET controller for booru tag search
 * @param {import("koa").Context} ctx The context
 */
module.exports.getSearch = async ctx => {
    // Parse tags
    let tagsRaw = ctx.request.query.query?.replace(/ /g, ',')
    let tags = []
    if(tagsRaw)
        tags = utils.setToArray(tagsRaw)
    
    // Set page title
    ctx.state.pageTitle = tags.length > 0 ? 'Tag Search - '+tags.join(' ') : 'Tag Search'

    // Fetch total media
    let totalMedia = await mediaModel.fetchBooruVisibleMediaCountByTags(tags)

    // Get pagination info
    let pagination = paginationUtil.paginatedRouteInfo(ctx, totalMedia, true)

    // Fetch media
    let media = await mediaModel.fetchBooruVisibleMediaInfosByTags(tags, pagination.queryOffset, pagination.queryLimit, mediaModel.Order.CREATED_DESC)

    // Enumerate tags from items
    let resultTags = []
    for(file of media)
        for(tag of file.tags)
            if(!resultTags.includes(tag))
                resultTags.push(tag)
    
    // Sort tags alphabetically
    resultTags.sort()
    
    // Put pagination information
    ctx.state.pagination = pagination

    // Put metadata if present
    let s = n => n == 1 ? '' : 's'
    ctx.state.metaDescription = tags.length > 0 ? `View ${totalMedia} result${s(totalMedia)} for the tag${s(tags.length)} "${tags.join(' ')}" on the booru` : `View all ${totalMedia} item${s(totalMedia)} on the booru`

    // Put data
    ctx.state.media = media
    ctx.state.resultTags = resultTags
    ctx.state.queryTags = tags
}
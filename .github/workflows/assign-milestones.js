// get the project
// check if the name matches a version x.y or x.y.z
// created
//   check that there is a corresponding milestone
//   else create that milestone
//   and assign the issue to the milestone
// deleted
//   get the issue
//   if issue is not closed,
//   remove issue from milestone, if any

// an issue or PR actually becomes a card (or, a card is actually created...) when
// it's move to a project column for the first time - being assigned to the project
// and showing in project's backlog is not enough.

module.exports = async ({github, context, core}) => {
   
    const restapi = github.rest

    function last1(s) {
        const pos = s.lastIndexOf('/')
        return s.substring(pos + 1)
    }

    function last2(s) {
        const pos1 = s.lastIndexOf('/')
        const pos2 = s.lastIndexOf('/', pos1-1)
        return [ s.substring(pos2 + 1, pos1), s.substring(pos1 + 1) ]
    }

    function firstOrDefault(items, predicate) {
        for (const item of items) {
            if (predicate(item)) {
                return item
            }
        }
        return null
    }

    // insanely enough, due to the total lack of documentation, this
    // is the best way one can figure out what exactly we are getting
    console.log(github)
    console.log(context)
    console.log(context.payload)

    //console.log(`event: ${github.event_name}/${github.event.action}`)

    // get and validate the event name
    const eventName = context.eventName
    if (eventName != 'project_card') {
        return
    }

    // get and validate the event action
    const eventAction = context.payload.action
    if (false && eventAction != 'created' && eventAction != 'deleted') {
        return
    }

    console.log(`event: ${eventName}/${eventAction}`)

    const columnId = context.payload.project_card.column_id
    const columnResponse = await restapi.projects.getColumn({
        column_id: columnId
    })
    const column = columnResponse.data
    console.log(column)

    const projectId = last1(column.project_url)
    const projectResponse = await restapi.projects.get({
        project_id: projectId
    });
    const project = projectResponse.data
    console.log(project)
    const projectName = project.name // this! is the project name, we want a milestone with the same name

    const cardId = context.payload.project_card.id
    const cardResponse = await restapi.projects.getCard({
        card_id: cardId
    })
    const card = cardResponse.data
    console.log(card)

    const [ itemType, itemNumber ] = last2(card.content_url)
    const isIssue = itemType == 'issues'
    const isPull = itemType == 'pulls'
    if (!isIssue && !isPull) {
        core.setFailed(`Unsupported item type ${itemType}`)
        return
    }
    const itemApi = isIssue ? restapi.issues : restapi.pulls

    var request = {
        owner: context.repo.owner,
        repo: context.repo.repo
    }
    request[isIssue ? 'issue_number' : 'pull_number'] = itemNumber

    const itemResponse = await itemApi.get(itemRequest)
    const item = itemResponse.data
    console.log(item)
    const itemId = item.id
    const itemMilestone = item.milestone
    console.log(`item: ${itemType}/${itemId} milestone: ${itemMilestone == null ? '<none>' : itemMilestone}`)

    if (eventAction == 'created') {
        console.log('add or update milestone of issue/pull of created card')

        const milestonesResponse = await restapi.issues.listMilestones({
            owner: context.repo.owner,
            repo: context.repo.repo
        })
        const milestones = milestonesResponse.data
        console.log(milestones)
        var milestone = firstOrDefault(milestones, (x) => x.title == projectName)

        if (!milestone) {
            console.log(`create milestone '${projectName}'`)
            const milestoneResponse = await restapi.issues.createMilestone({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: projectName
            })
            milestone = milestoneResponse.data
        }

        const milestoneId = milestone.id

        request = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            milestone: milestoneId
        }
        request[isIssue ? 'issue_number' : 'pull_number'] = itemNumber
        await itemApi.update(request)
    }
    else if (eventAction == 'deleted') {
        if (itemMilestone) {
            console.log('remove milestone from issue/pull of deleted card')
            request = {
                owner: context.repo.owner,
                repo: context.repo.repo
            }
            request[isIssue ? 'issue_number' : 'pull_number'] = itemNumber
            request.milestone = null
            await itemApi.update(request)
        }
        else {
            console.log('deleted card had no milestone')
        }
    }
    else {
        console.log(`nothing to do for evet action ${eventAction}`)
    }

    /*

    // get and validate the card
    const cardMeh = context.action.card_number

    // get and validate the project

    // get and validate the card item

    // 
    if (eventAction == 'deleted') {

    }

    //const project_name = 'The API Team Board'

    const project_name = 'test-project'

    function firstOrDefault(items, predicate) {
        for (const item of items) {
            if (predicate(item)) {
                return item
            }
        }
        return null
    }

    // find the card
    // find the type: issue, PR, note
    // if issue or PR
    // find corresponding milestone
    // created if needed
    // assign milestone
    // madness - this is the only way we can explore context ?!
    console.log(context);
    console.log(context.payload);
    return;

    // find the project
    console.log('find project...')
    const projects = await restapi.projects.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo
    })
    console.log(`retrieved ${projects.data.length} projects.`)
    const project = firstOrDefault(projects.data, (x) => x.name === project_name)
    if (!project) {
        core.setFailed(`Failed to find project "${project_name}".`)
        return
    }
    else {
        console.log(`project id: ${project.id}.`)
    }

    // determine content type
    console.log('determine content type...')
    const event_name = context.eventName
    var content_type = null
    if (event_name === 'issues') {
        content_type = 'Issue'
    }
    if (event_name === 'pull_request') {
        content_type = 'PullRequest'
    }
    if (!content_type) {
        core.setFailed(`Unexpected event name "${event_name}".`)
        return
    }
    else {
        console.log(`content type: ${content_type}.`)
    }

    // get the issue/pr
    console.log('get the issue/pr...')
    const item = await restapi.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number
    })
    if (!item) {
        core.setFailed(`Failed to get issue ${context.issue.number}.`)
        return
    }
    else {                
        console.log(`issue id: ${item.data.id}.`)
    }
                
    console.log('create the card...')
    console.log(`in column ${column.id} for item ${item.data.id} of type ${content_type}`)
    await restapi.projects.createCard({
        column_id: column.id,
        //note:,
        content_id: item.data.id,
        content_type: content_type
    })
    console.log('created')
    */
}


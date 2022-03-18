module.exports = /*async*/ ({github, context, core}) => {
   
    const restapi = github.rest

    function firstOrDefault(items, predicate) {
        for (const item of items) {
            if (predicate(item)) {
                return item
            }
        }
        return null
    }

    async function validateRelease() {

        const version = context.payload.inputs.version
        const tag = "v" + version
        console.log(`Validate version '${version}'.`)
        const release = restapi.repos.getReleaseByTag({
            owner: context.repo.owner,
            repo: context.repo.repo,
            tag: tag
          })
        if (release === null) {
            core.setFailed(`Could not find a GitHub release for tag '${tag}'.`)
            return
        }
        if (release.draft) {
            core.setFailed(`GitHub release for tag '${tag}' is already published.`)
            return
        }
        try {
            const ref = await restapi.git.getRef({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: 'tags/' + tag
            })
            core.setFailed(`Tag '${tag}' already exists.`)
            return
        }
        catch (error) {
            // this is expected - the tag should not exist
        }

        console.log(`Found a yet-unpublished GitHub Release for tag '${tag}' which does not exist yet.`)
    }   

    function test() {
        console.log('TEST')
    }

    return {
        test: test,
        validateRelease: validateRelease
    }
}

// see https://github.com/actions/github-script
// , core, glob, io, exec, require
module.exports = function (github, context) {
    
    var module = {}
    
    // this is *not* exported
    function noop ( ) { }

    // this *is* exported
    module.getReleaseByTag = async function (tag_name) {
        var rel = null
        try {
            // this does *not* return draft releases, so we have to list them
            //rel = await github.repos.getReleaseByTag({ ... })
            const rels = await github.repos.listReleases({
                owner: context.repo.owner,
                repo: context.repo.repo
            })
            for (const r of rels.data) {
                if (r.tag_name === tag_name) {
                    rel = r
                    break
                }
            }
        }
        catch (error) {
            return null
        }
        return rel
    }
    
    module.getRefReleaseTag = function (ref) {
        // test, must start with 'refs/heads/release/' 19 chars
        return "v" + ref.substring(19)
    }
    
    return module;
}

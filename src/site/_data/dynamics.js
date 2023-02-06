const fsFileTree = require("fs-file-tree");

const BASE_PATH = "src/site/_includes/components/user"
const NOTES_PATH = `${BASE_PATH}/notes`
const COMMON_PATH = `${BASE_PATH}/common`

module.exports = async () => {
    const note_comp_tree = await fsFileTree(`${NOTES_PATH}/footers`);
    let note_footers = Object.keys(note_comp_tree).filter((p) => p.indexOf(".njk") != -1).map((p) => `components/user/notes/footers/${p}`);
    
    const common_comp_tree = await fsFileTree(`${COMMON_PATH}/footers`);
    let common_footers = Object.keys(common_comp_tree).filter((p) => p.indexOf(".njk") != -1).map((p) => `components/user/common/footers/${p}`);
    return {
        notes: {
            footers: note_footers,
        },
        common: {
            footers: common_footers
        }
    }
}
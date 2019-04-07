const state = {
    lastState: {},
    currentFolderList: []
};

const mutations = {
    SET_LAST_STATE(state, { lastWorkspaceId, lastFolderId, lastRequestId, openedSubmenuList }) {
        state.lastState = {
            lastWorkspaceId,
            lastFolderId,
            lastRequestId,
            openedSubmenuList
        };
    },
    SET_CURRENT_FOLDER_LIST(state, newVal) {
        state.currentFolderList = newVal;
    }
};

const actions = {
    updateLastState({ commit, state }, lastState) {
        commit('SET_LAST_STATE', lastState);
    },
    updateCurrentFolderList({ commit }, newVale) {
        commit('SET_CURRENT_FOLDER_LIST', newVale);
    }
};

export default {
    state,
    mutations,
    actions
};

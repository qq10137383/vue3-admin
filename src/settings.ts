/**
 * App Settings
 */
export interface Settings {
    /**
     * App title
     */
    title: string,
    /**
     * Whether show the settings right-panel
     */
    showSettings: boolean,
    /**
     * Whether need tagsView
     */
    tagsView: boolean,
    /**
     * Whether fix the header
     */
    fixedHeader: boolean,
    /**
     * Whether show the logo in sidebar
     */
    sidebarLogo: boolean,
    /**
     * Need show err logs component
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: string | string[]
}

const settings: Settings = {
    title: "Vue Element Admin",
    showSettings: true,
    tagsView: true,
    fixedHeader: false,
    sidebarLogo: false,
    errorLog: ['development', 'production']
}

export default settings;
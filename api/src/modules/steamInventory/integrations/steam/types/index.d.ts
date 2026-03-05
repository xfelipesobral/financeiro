interface IntegrationSteamInventoryResponse {
    assets: {
        appid: number
        contextid: string
        assetid: string
        classid: string
        instanceid: string
        amount: string
    }[]
    descriptions: {
        appid: number
        classid: string
        instanceid: string
        currency: number
        background_color: string
        icon_url: string
        tradable: number
        actions: {
            link: string
            name: string
        }[]
        descriptions: {
            type: string
            value: string
            name: string
        }[]
        name: string
        name_color: string
        type: string
        market_name: string
        market_hash_name: string
        marketable: number
        tags: {
            category: string
            internal_name: string
            localized_category_name: string
            localized_tag_name: string
        }[]
        sealed: number
        market_bucket_group_name: string
        market_bucket_group_id: string
        sealed_type: number
    }[]
}

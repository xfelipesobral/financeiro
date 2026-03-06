export function formatColor(color: string) {
    if (color && !color.startsWith('#')) {
        return `#${color}`
    }

    return color
}

export function formatImageUrl(imageUrl: string) {
    if (imageUrl && !imageUrl.startsWith('http')) {
        return `https://steamcommunity-a.akamaihd.net/economy/image/${imageUrl}`
    }

    return imageUrl
}

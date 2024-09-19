/**
 * 获取通过不同的权重随机出怪兽id
 * @param data 
 * @returns 
 */
export const weightedRandom = (data:number[][]) =>{
    const values = data.map(d=>d[0])
    const weights = data.map(d=>d[1])
    const cumulativeWeights:number[] = []
    weights.reduce((pre,cur,index)=>{
        cumulativeWeights[index] = pre + cur
        return pre + cur
    },weights[0])
    console.log(values,weights,cumulativeWeights)
    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]
    //获取最大数中的随机数
    const random = maxCumulativeWeight * Math.random()
    //通过对比过滤获取返回的长度，作为index
    const index = cumulativeWeights.filter(ele => ele <= random).length

    return values[index]
}

/**
 * 生成uuid
 * @returns 
 */
export const generateUuid = () =>{
    return Phaser.Math.RND.uuid()
}
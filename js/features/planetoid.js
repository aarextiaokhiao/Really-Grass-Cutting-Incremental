function getPlanetoidSave() {
    let s = {
        pm: E(0),
        bestPm: E(0),

        level: 0,
        xp: E(0),

        firstEnter: false,
        active: false,

        ring: E(0),
        bestRing: E(0),

        observ: E(0),
        reserv: E(0),

        astro: E(0),
        bestAstro: E(0),

        measure: E(0),
        bestMeasure: E(0),

        planet: E(0),
        planetTier: 0,
        bestPlanet: E(0),
    }

    return s
}

const PLANETOID = {
    planetGain() {
        let x = E(5)
        
        .mul(upgEffect('planetarium',1))
        .mul(upgEffect('observ',0))

        .mul(starTreeEff('ring',0))
        .mul(starTreeEff('ring',4))
        .mul(starTreeEff('ring',9))
        .mul(starTreeEff('ring',14))
        .mul(starTreeEff('ring',19))
        .mul(starTreeEff('ring',24))
        .mul(starTreeEff('ring',29))

        .mul(upgEffect('astro',0))

        .mul(upgEffect('measure',1))

        .mul(upgEffect('planet',0))

        .mul(getLEffect(6))
        
        if (player.planetoid.planetTier>=1) x = x.mul(getPTEffect(0))

        x = x.pow(starTreeEff('reserv',7))

        if (hasStarTree('reserv',22)) x = x.mul(tmp.compact)

        return x
    },
    cosmicGain() {
        let x = E(1)
        
        .mul(upgEffect('planetarium',2))
        .mul(upgEffect('observ',2))
        .mul(upgEffect('observ',5))

        .mul(starTreeEff('ring',1))
        .mul(starTreeEff('ring',13))
        .mul(starTreeEff('ring',17))
        .mul(starTreeEff('ring',21))
        .mul(starTreeEff('ring',26))

        .mul(starTreeEff('reserv',15))

        .mul(getLEffect(3))

        if (player.planetoid.planetTier>=1) x = x.mul(getPTEffect(0))

        x = x.pow(starTreeEff('reserv',6))

        if (hasStarTree('reserv',22)) x = x.mul(tmp.compact)

        return x
    },
    level: {
        req(i) {
            i = E(i).scale(200,2,0)

            let x = Decimal.pow(tmp.cosmicLevel.threshold,i**0.87).mul(50)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(50)
            if (x.lt(1)) return 0
            x = x.log(tmp.cosmicLevel.threshold).root(.87).scale(200,2,0,true)

            return Math.floor(x.toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
    },
    ringGain() {
        let lvl = player.planetoid.level-4

        if (lvl <= 0) return E(0)

        let x = Decimal.pow(1.1,lvl-1).mul((lvl+1)/2)

        if (player.planetoid.bestPm.gte(1e9)) x = x.mul(Decimal.pow(10,player.planetoid.bestPm.log10().sub(8).root(2).sub(1)))

        tmp.ringGainBase = x

        x = x

        .mul(upgEffect('observ',1))
        .mul(upgEffect('observ',6))

        .mul(starTreeEff('reserv',0))

        .mul(upgEffect('astro',1))

        .mul(upgEffect('measure',2))

        .mul(upgEffect('cloud',2))

        if (player.lowGH <= -40) x = x.mul(getAGHEffect(17))

        x = x.mul(getASEff('ring'))

        return x.floor()
    },
    observGain() {
        let x = E(1)

        .mul(starTreeEff('ring',5))
        .mul(starTreeEff('ring',11))
        .mul(starTreeEff('ring',15))
        .mul(starTreeEff('ring',20))
        .mul(starTreeEff('ring',25))
        .mul(starTreeEff('ring',30))

        .mul(upgEffect('measure',0))
        .mul(upgEffect('measure',4))

        .mul(upgEffect('planet',1))

        if (hasStarTree('reserv',22)) x = x.mul(tmp.compact)

        return x.floor()
    },
    astroGain() {
        let lvl = player.planetoid.level-29

        if (lvl <= 0) return E(0)

        let x = Decimal.pow(1.1,lvl-1).mul(lvl).mul(player.planetoid.bestPm.div(1e12).max(1).root(3))

        tmp.astroGainBase = x

        x = x

        .mul(upgEffect('observ',4))
        .mul(upgEffect('observ',7))
        .mul(starTreeEff('ring',18))

        if (player.planetoid.planetTier>=2) x = x.mul(getPTEffect(1))

        return x.floor()
    },
    measureGain() {
        let lvl = player.planetoid.level-99

        if (lvl <= 0) return E(0)

        let x = Decimal.pow(1.1,lvl-1).mul(lvl).mul(player.planetoid.bestAstro.div(1e15).max(1).root(3))

        tmp.measureGainBase = x

        x = x

        .mul(starTreeEff('ring',27))
        .mul(upgEffect('observ',8))

        if (player.planetoid.planetTier>=2) x = x.mul(getPTEffect(1))

        return x.floor()
    },
    planetary: {
        gain() {
            let lvl = player.planetoid.level-199

            if (lvl <= 0) return E(0)

            let x = Decimal.pow(1.1,lvl-1).mul(lvl).mul(player.planetoid.bestMeasure.div(1e15).max(1).root(3))

            tmp.planetGainBase = x

            return x.floor()
        },
        tierReq() {
            let p = player.planetoid.planetTier
            let x = 200+10*p

            return x
        },
        milestone: [
            {
                r: 1,
                desc: `Gain <b class='green'>+200%</b> more Planetarium and Cosmic per planetary tier.`,
                effect: _=>player.planetoid.planetTier*2+1,
                effDesc: x=> formatMult(x),
            },{
                r: 2,
                desc: `Gain <b class='green'>+100%</b> more Astro and Measure per planetary tier.`,
                effect: _=>player.planetoid.planetTier+1,
                effDesc: x=> formatMult(x),
            },{
                r: 5,
                desc: `Unlock <b class='green'>Grass Jump</b> in Unnatural Realm.`,
            },{
                r: 6,
                desc: `Gain more XP based on planetary tier.`,
                effect: _=>Decimal.pow(10,player.planetoid.planetTier**1.75),
                effDesc: x=> formatMult(x),
            },{
                r: 10,
                desc: `You can equip <b class='green'>1</b> more lunar slot per 5 planetary tiers, starting at 10.`,
                effect: _=>Math.floor(Math.max(player.planetoid.planetTier-5,0)/5),
                effDesc: x=>"+"+format(x,0),
            },
        ],
    },
}

tmp_update.push(_=>{
    tmp.planetiumGain = PLANETOID.planetGain()
    tmp.cosmicGain = PLANETOID.cosmicGain()

    let lvl = player.planetoid.level

    let th = 1

    tmp.cosmicLevel.threshold = 3**th

    tmp.cosmicLevel.next = PLANETOID.level.req(lvl)
    tmp.cosmicLevel.bulk = PLANETOID.level.bulk(player.planetoid.xp)
    tmp.cosmicLevel.cur = PLANETOID.level.cur(lvl)
    tmp.cosmicLevel.progress = player.planetoid.xp.sub(tmp.cosmicLevel.cur).max(0).min(tmp.cosmicLevel.next)
    tmp.cosmicLevel.percent = tmp.cosmicLevel.progress.div(tmp.cosmicLevel.next.sub(tmp.cosmicLevel.cur)).max(0).min(1).toNumber()

    tmp.ringGain = PLANETOID.ringGain()
    tmp.observGain = PLANETOID.observGain()

    tmp.reservConvert = starTreeEff('ring',8,0)+starTreeEff('ring',12,0)+starTreeEff('ring',28,0)
    tmp.reservGain = player.planetoid.observ.mul(tmp.reservConvert).floor()

    tmp.astroGain = PLANETOID.astroGain()
    tmp.measureGain = PLANETOID.measureGain()

    tmp.planetGain = PLANETOID.planetary.gain()
    tmp.planetTierReq = PLANETOID.planetary.tierReq()

    tmp.starGen = starTreeEff('reserv',3,0)
    tmp.funGen = starTreeEff('reserv',4,0)
    tmp.ringGen = hasStarTree('reserv',5)?0.0001:0
    if (hasStarTree('reserv',10)) tmp.ringGen *= 10
    if (hasStarTree('reserv',21)) tmp.ringGen *= 10
    if (hasStarTree('reserv',29)) tmp.ringGen *= 10

    tmp.npGen = starTreeEff('reserv',12,0)

    tmp.aGen = starTreeEff('reserv',18,0)
    tmp.dmGen = starTreeEff('reserv',19,0)

    tmp.measureGen = starTreeEff('reserv',26,0)
    tmp.momentumGen = starTreeEff('reserv',27,0)
    tmp.planetGen = starTreeEff('reserv',32,0)

    tmp.observChance = hasStarTree('ring',30)?0.05:hasStarTree('ring',25)?0.02:hasStarTree('ring',20)?0.01:0.003
})

RESET.enterPlanetoid = {
    unl: _=> player.lowGH<=-32,

    req: _=>true,
    reqDesc: _=>`how.`,

    resetDesc: `You may enter or exit the Planetoid. During the Planetoid, pre-planetoid resources' production is paused, wiped by Galactic.`,
    resetGain: _=> `Exiting the Planetoid will keep its resources.`,

    title: `Planetoid`,
    resetBtn: `Enter the Planetoid`,

    reset(force=false) {
        player.planetoid.firstEnter = true
        player.planetoid.active = !player.planetoid.active

        player.decel = false
        player.recel = false

        mapPos.earth = [3, 3]
        goToSpace()

        resetGlasses()

        if (player.planetoid.active) RESET.gal.reset(true)
    },
}

RESET.formRing = {
    unl: _=> player.planetoid.active,

    req: _=>player.planetoid.level >= 5,
    reqDesc: _=>`Reach Level 5.`,

    resetDesc: `To earn rings, reset planetarium, level, astrolabe, and quadrant. Check upgrades in star chart.<br>Gain more rings based on your level and planetarium.`,
    resetGain: _=> `Gain <b>${tmp.ringGain.format(0)}</b> Rings`+(tmp.reservConvert>0?", <b>"+tmp.reservGain.format(0)+"</b> Reservatorium.":"."),

    title: `Form Ring`,
    resetBtn: `Form the Ring`,

    reset(force=false) {
        if (force || this.req()) {
            if (!force) {
                player.planetoid.ring = player.planetoid.ring.add(tmp.ringGain)
                player.planetoid.bestRing = player.planetoid.bestRing.max(player.planetoid.ring)

                if (tmp.reservConvert>0 && tmp.reservGain.gt(0)) {
                    player.planetoid.reserv = player.planetoid.reserv.add(tmp.reservGain)
                    player.planetoid.observ = E(0)
                }
            }

            this.doReset()
        }
    },

    doReset(order='ring') {
        resetGlasses()

        let pd = player.planetoid

        pd.pm = E(0)
        pd.bestPm = E(0)
        pd.xp = E(0)
        pd.level = 0

        resetUpgrades('planetarium')

        if (order!='astro') {
            player.planetoid.astro = E(0)
            player.planetoid.bestAstro = E(0)
            resetUpgrades('astro')

            if (order!='quadrant') {
                player.planetoid.measure = E(0)
                player.planetoid.bestMeasure = E(0)
                resetUpgrades('measure')
            }
        }
    }
}

UPGS.planetarium = {
    unl: _=> player.planetoid.active,

    autoUnl: _=>hasStarTree('reserv',9),
    noSpend: _=>hasStarTree('reserv',9),

    title: "Planetarium Upgrades",

    ctn: [
        {
            max: 250,

            title: "Planetarium Grow Speed",
            desc: `Increase grass grow speed by <b class="green">20%</b> per level.`,

            res: "pm",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(1.5,i).mul(1000).ceil(),
            bulk: i => i.div(1000).max(1).log(1.5).floor().toNumber()+1,

            effect(i) {
                let x = i/5+1

                return x
            },
            effDesc: x => format(x)+"x",
        },{
            max: 1000,

            title: "Planetarium Planetarium",
            desc: `Increase Planetarium gain by <b class="green">1</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

            res: "pm",
            icon: ['Curr/Planetoid'],
            
            cost: i => Decimal.pow(1.25,i).mul(5000).ceil(),
            bulk: i => i.div(5000).max(1).log(1.25).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: 1000,

            title: "Planetarium Cosmic",
            desc: `Increase cosmic gain by <b class="green">1</b> per level.<br>This effect is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

            res: "pm",
            icon: ['Icons/XP2'],
            
            cost: i => Decimal.pow(1.25,i).mul(25000).ceil(),
            bulk: i => i.div(25000).max(1).log(1.25).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

                return x
            },
            effDesc: x => x.format()+"x",
        },{
            max: 10,

            title: "Planetarium Range",
            desc: `Increase grass cut range by <b class="green">10</b> per level.`,

            res: "pm",
            icon: ['Icons/Range'],
            
            cost: i => Decimal.pow(2.5,i).mul(1e5).ceil(),
            bulk: i => i.div(1e5).max(1).log(2.5).floor().toNumber()+1,

            effect(i) {
                let x = i*10

                return x
            },
            effDesc: x => "+"+format(x,0),
        },
    ]
}

UPGS.observ = {
    unl: _=> player.planetoid.active,

    title: "The Observatory",

    underDesc: _=>`You have ${format(player.planetoid.observ,0)} Observatorium (${formatPercent(tmp.observChance)} grow chance)`,

    ctn: [
        {
            max: 100,

            title: "Planetarium Observation",
            desc: `Increase planetarium gain by <b class="green">+50%</b> per level.`,

            res: "observ",
            icon: ['Curr/Planetoid'],
            costOnce: true,
            
            cost: i => E(5),
            bulk: i => i.div(5).floor().toNumber(),

            effect(i) {
                let x = i/2+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Rings Observation",
            desc: `Increase rings gain by <b class="green">+10%</b> per level.`,

            res: "observ",
            icon: ['Curr/Ring'],
            costOnce: true,
            
            cost: i => E(8),
            bulk: i => i.div(8).floor().toNumber(),

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Cosmic Observation",
            desc: `Increase cosmic gain by <b class="green">+50%</b> per level.`,

            res: "observ",
            icon: ['Icons/XP2'],
            costOnce: true,
            
            cost: i => E(8),
            bulk: i => i.div(8).floor().toNumber(),

            effect(i) {
                let x = i/2+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Grow Speed Observation",
            desc: `Increase grass grow speed by <b class="green">+20%</b> per level.`,

            res: "observ",
            icon: ['Icons/Speed'],
            costOnce: true,
            
            cost: i => E(15),
            bulk: i => i.div(15).floor().toNumber(),

            effect(i) {
                let x = i/5+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Astro Observation",
            desc: `Increase astro gain by <b class="green">10%</b> per level.`,

            res: "observ",
            icon: ['Curr/Astrolabe'],
            costOnce: true,
            
            cost: i => E(1e3),
            bulk: i => i.div(1e3).floor().toNumber(),

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Cosmic Observation II",
            desc: `Increase cosmic gain by <b class="green">+25%</b> per level.`,

            res: "observ",
            icon: ['Icons/XP2'],
            costOnce: true,
            
            cost: i => E(2500),
            bulk: i => i.div(2500).floor().toNumber(),

            effect(i) {
                let x = i/4+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Rings Observation II",
            desc: `Increase rings gain by <b class="green">+5%</b> per level.`,

            res: "observ",
            icon: ['Curr/Ring'],
            costOnce: true,
            
            cost: i => E(1e4),
            bulk: i => i.div(1e4).floor().toNumber(),

            effect(i) {
                let x = i/20+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Astro Observation II",
            desc: `Increase astro gain by <b class="green">10%</b> per level.`,

            res: "observ",
            icon: ['Curr/Astrolabe'],
            costOnce: true,
            
            cost: i => E(1e6),
            bulk: i => i.div(1e6).floor().toNumber(),

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Measure Observation",
            desc: `Increase astro gain by <b class="green">25%</b> per level.`,

            res: "observ",
            icon: ['Curr/Measure'],
            costOnce: true,
            
            cost: i => E(1e9),
            bulk: i => i.div(1e9).floor().toNumber(),

            effect(i) {
                let x = i/4+1

                return x
            },
            effDesc: x => formatMult(x),
        },
    ],
}

// Astrolabe (Astro)

RESET.astro = {
    unl: _=> player.planetoid.active,

    req: _=>player.planetoid.level>=30,
    reqDesc: _=>`Reach Level 30.`,

    resetDesc: `Reset your planetarium, planetarium upgrades, and level for astro.<br>Gain more Astro based on your level and planetarium.`,
    resetGain: _=> `Gain <b>${tmp.astroGain.format(0)}</b> Astro`,

    title: `Astrolabe`,
    resetBtn: `Use the Astrolabe`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.planetoid.astro = player.planetoid.astro.add(tmp.astroGain)
                player.planetoid.bestAstro = player.planetoid.bestAstro.max(player.planetoid.astro)
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="astro") {
        RESET.formRing.doReset(order)

        updateTemp()
    },
}

UPGS.astro = {
    unl: _=> player.planetoid.active,

    title: "Astro Upgrades",

    underDesc: _=>`You have ${format(player.planetoid.astro,0)} Astro`+gainHTML(player.planetoid.astro,tmp.astroGain,tmp.aGen),

    autoUnl: _=>hasStarTree('reserv',13),
    noSpend: _=>hasStarTree('reserv',13),

    ctn: [
        {
            max: 1000,

            title: "Astro Planetarium",
            desc: `Increase planetarium gain by <b class="green">+50%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "astro",
            icon: ['Curr/Planetoid'],
            
            cost: i => Decimal.pow(1.2,i).mul(1).ceil(),
            bulk: i => i.div(1).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/2+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Astro Rings",
            desc: `Increase ring gain by <b class="green">+25%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "astro",
            icon: ['Curr/Ring'],
            
            cost: i => Decimal.pow(1.3,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.3).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Astro Grow Speed",
            desc: `Increase grow speed by <b class="green">+20%</b> per level.`,

            res: "astro",
            icon: ['Icons/Speed'],
            
            cost: i => Decimal.pow(1.3,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.3).floor().toNumber()+1,

            effect(i) {
                let x = i/5+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Astro XP",
            desc: `Increase XP gain by <b class="green">+50%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "astro",
            icon: ['Icons/XP'],
            
            cost: i => Decimal.pow(1.2,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/2+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Astro Compaction",
            desc: `Increase compaction by <b class="green">+25%</b> per level.`,

            res: "astro",
            icon: ['Icons/Compaction'],
            
            cost: i => Decimal.pow(1.2,i).mul(1e6).ceil(),
            bulk: i => i.div(1e6).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = i/4+1

                return x
            },
            effDesc: x => formatMult(x),
        },
    ],
}

RESET.quadrant = {
    unl: _=> player.planetoid.active,

    req: _=>player.planetoid.level>=100,
    reqDesc: _=>`Reach Level 100.`,

    resetDesc: `Reset your astro, astro upgrades, and previous contents for measure.<br>Gain more Measures based on your level and astro.`,
    resetGain: _=> `Gain <b>${tmp.measureGain.format(0)}</b> Measures`,

    title: `Quadrant`,
    resetBtn: `Use the Quadrant`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.planetoid.measure = player.planetoid.measure.add(tmp.measureGain)
                player.planetoid.bestMeasure = player.planetoid.bestMeasure.max(player.planetoid.measure)
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="quadrant") {
        RESET.formRing.doReset(order)

        updateTemp()
    },
}

UPGS.measure = {
    unl: _=> player.planetoid.active,

    title: "Measure Upgrades",

    underDesc: _=>`You have ${format(player.planetoid.measure,0)} Measure`+gainHTML(player.planetoid.measure,tmp.measureGain,tmp.measureGen),

    autoUnl: _=>hasStarTree('reserv',24),
    noSpend: _=>hasStarTree('reserv',24),

    ctn: [
        {
            max: 10,

            title: "Measured Observatorium",
            desc: `Increase observatorium gain by <b class="green">+10%</b> per level.`,

            res: "measure",
            icon: ['Curr/Observatorium'],
            costOnce: true,
            
            cost: i => E(5),
            bulk: i => i.div(5).floor().toNumber(),

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Measured Planetarium",
            desc: `Increase planetarium gain by <b class="green">+50%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "measure",
            icon: ['Curr/Planetoid'],
            
            cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/2+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Measured Ring",
            desc: `Increase ring gain by <b class="green">+25%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "measure",
            icon: ['Curr/Ring'],
            
            cost: i => Decimal.pow(1.25,i).mul(100).ceil(),
            bulk: i => i.div(100).max(1).log(1.25).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/4+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 10,

            title: "Measured XP-Exponent",
            desc: `Increase XP exponent by <b class="green">+10%</b> per level.`,

            res: "measure",
            icon: ['Icons/XP',"Icons/Exponent"],
            
            cost: i => Decimal.pow(10,i**1.25).mul(1e4).ceil(),
            bulk: i => i.div(1e4).max(1).log(10).root(1.25).floor().toNumber()+1,

            effect(i) {
                let x = i/10+1

                return x
            },
            effDesc: x => "^"+format(x),
        },{
            max: 1000,

            title: "Measured Observatorium II",
            desc: `Increase observatorium gain by <b class="green">+10%</b> per level.<br>This effect is increased by <b class="green">25%</b> every <b class="yellow">25</b> levels.`,

            res: "measure",
            icon: ['Curr/Observatorium'],
            
            cost: i => Decimal.pow(1.25,i).mul(1e6).ceil(),
            bulk: i => i.div(1e6).max(1).log(1.25).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.25,Math.floor(i/25)).mul(i/10+1)

                return x
            },
            effDesc: x => formatMult(x),
        },
    ],
}

RESET.planetary = {
    unl: _=>player.planetoid.active&&player.lowGH<=-48,

    req: _=>player.planetoid.level>=200,
    reqDesc: _=>`Reach Level 200.`,

    resetDesc: `<span style="font-size:14px">
    Reset your measure, measure upgrades, and previous contents for Planets.<br>Gain more Planets based on your level and measure.<br><br>
    To reach the planetary tier, you must reach Level <b id='PTReq'>???</b>.
    </span>`,
    resetGain: _=> `Gain <b>${tmp.planetGain.format(0)}</b> Planets`,

    title: `Planetary`,
    resetBtn: `Go Planetary`,

    reset(force=false) {
        if (this.req()||force) {
            if (!force) {
                player.planetoid.planet = player.planetoid.planet.add(tmp.planetGain)
                player.planetoid.bestPlanet = player.planetoid.bestPlanet.max(player.planetoid.planet)

                if (player.planetoid.level >= tmp.planetTierReq) {
                    player.planetoid.planetTier++
                }
            }

            updateTemp()

            this.doReset()
        }
    },

    doReset(order="planet") {
        RESET.formRing.doReset(order)

        updateTemp()
    },
}

UPGS.planet = {
    unl: _=>player.planetoid.active&&player.lowGH<=-48,

    title: "Planet Upgrades",

    underDesc: _=>`You have ${format(player.planetoid.planet,0)} Planet`+gainHTML(player.planetoid.planet,tmp.planetGain,tmp.planetGen),

    autoUnl: _=>hasStarTree('reserv',31),
    noSpend: _=>hasStarTree('reserv',31),

    ctn: [
        {
            max: 1000,

            title: "Planetary Planetarium of Planetness",
            desc: `Increase planetarium gain by <b class="green">+50%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "planet",
            icon: ['Curr/Planetoid'],
            
            cost: i => Decimal.pow(1.2,i).mul(3).ceil(),
            bulk: i => i.div(3).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/2+1)

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 100,

            title: "Planetary Observatorium",
            desc: `Increase observatorium gain by <b class="green">+50%</b> per level.`,

            res: "planet",
            icon: ['Curr/Observatorium'],
            
            cost: i => Decimal.pow(1.2,i).mul(3).ceil(),
            bulk: i => i.div(3).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = i/2+1

                return x
            },
            effDesc: x => formatMult(x),
        },{
            max: 1000,

            title: "Planetary Level",
            desc: `Increase XP gain by <b class="green">+50%</b> per level.<br>This effect is increased by <b class="green">50%</b> every <b class="yellow">25</b> levels.`,

            res: "planet",
            icon: ['Icons/XP'],
            
            cost: i => Decimal.pow(1.2,i).mul(10).ceil(),
            bulk: i => i.div(10).max(1).log(1.2).floor().toNumber()+1,

            effect(i) {
                let x = Decimal.pow(1.5,Math.floor(i/25)).mul(i/2+1)

                return x
            },
            effDesc: x => formatMult(x),
        },
    ],
}

function getPTEffect(x,def=1) { return tmp.ptEffect[x]!==undefined?tmp.ptEffect[x]:def }

el.update.planetoid = _ => {
    if (mapID == 'gh') {
        tmp.el.PTReq.setHTML(format(tmp.planetTierReq,0))

        let unl = player.planetoid.active&&player.lowGH<=-48

        tmp.el.milestone_div_planetary.setDisplay(unl)

        if (unl) {
            tmp.el.planetTier.setHTML(format(player.planetoid.planetTier,0))
    
            for (let x in PLANETOID.planetary.milestone) {
                let m = PLANETOID.planetary.milestone[x]
                let id = "pt_mil_ctn"+x
    
                tmp.el[id+"_div"].setClasses({bought: player.planetoid.planetTier >= m.r})
                if (m.effDesc) tmp.el[id+"_eff"].setHTML(m.effDesc(tmp.ptEffect[x]))
            }
        }
    }
}
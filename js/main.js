function loop() {
    diff = Date.now() - date
    updateTemp()
    updateHTML()
    calc(diff/1000);
    date = Date.now();
}

var player = {}, date = Date.now(), diff = 0;
const MAIN = {
    grassGain() {
        let x = Decimal.mul(5,upgEffect('grass',0)).mul(tmp.tier.mult)

        x = x.mul(upgEffect('perk',0))
        x = x.mul(upgEffect('pp',0))
        x = x.mul(upgEffect('crystal',0))
        x = x.mul(upgEffect('plat',2))

        x = x.mul(chalEff(1))

        if (player.grasshop >= 1) {
            x = x.mul(5).mul(getGHEffect(0))
        }

        x = x.mul(upgEffect('aGrass',3))
        x = x.mul(upgEffect('ap',0))
        x = x.mul(upgEffect('oil',0))

        x = x.mul(upgEffect('rocket',0))
        x = x.mul(upgEffect('momentum',0))

        x = x.mul(starTreeEff('speed',3))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',0))

        if (player.lowGH <= 36) x = x.mul(getAGHEffect(0))

        if (player.decel) x = x.div(1e15)

        if (x.lt(1)) return x

        x = x.pow(chalEff(3))
        if (inChal(3) || inChal(5)) x = x.root(2)

        return x
    },
    grassCap() {
        let x = 10+upgEffect('grass',1,0)+upgEffect('perk',1,0)+upgEffect('ap',4,0)+starTreeEff('progress',0,0)
        if (player.options.lowGrass) x = Math.min(x, 250)

        return x
    },
    grassSpawn() {
        let x = 2.5
        x /= upgEffect('grass',2,1)
        x /= upgEffect('perk',2,1)
        x /= upgEffect('aGrass',1,1)
        x /= upgEffect('momentum',1)
        return x
    },
    xpGain() {
        let x = Decimal.mul(3,upgEffect('grass',3)).mul(tmp.tier.mult)

        x = x.mul(upgEffect('perk',3))
        x = x.mul(upgEffect('pp',1))
        x = x.mul(upgEffect('crystal',1))
        x = x.mul(upgEffect('plat',1))

        x = x.mul(chalEff(0))

        x = x.mul(tmp.chargeEff[1]||1)

        if (player.grasshop >= 2) {
            x = x.mul(5).mul(getGHEffect(1))
        }

        x = x.mul(upgEffect('aGrass',4))
        x = x.mul(upgEffect('ap',2))
        x = x.mul(upgEffect('oil',1))
        x = x.mul(upgEffect('momentum',2))

        x = x.mul(upgEffect('rocket',1))

        x = x.mul(starTreeEff('speed',4))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',1))
        
        if (player.lowGH <= 32) x = x.mul(getAGHEffect(1))

        if (player.decel) x = x.div(1e16)

        if (x.lt(1)) return x

        if (inChal(3) || inChal(5)) x = x.root(2)

        if (!player.decel && hasUpgrade('plat',10)) x = x.pow(upgEffect('plat',10,1))

        return x
    },
    tpGain() {
        if (inChal(2) || inChal(7)) return E(0)

        let x = upgEffect('pp',2)

        x = x.mul(upgEffect('crystal',2))
        x = x.mul(upgEffect('perk',6))

        x = x.mul(chalEff(2))

        x = x.mul(tmp.chargeEff[3]||1)

        if (player.grasshop >= 3) {
            x = x.mul(5).mul(getGHEffect(2))
        }

        x = x.mul(upgEffect('ap',3))
        x = x.mul(upgEffect('oil',2))

        x = x.mul(upgEffect('rocket',2))
        x = x.mul(upgEffect('momentum',3))

        x = x.mul(starTreeEff('speed',5))
        if (!player.decel) x = x.mul(starTreeEff('progress',6))

        x = x.mul(upgEffect('moonstone',2))

        if (player.lowGH <= 28) x = x.mul(getAGHEffect(2))

        if (player.decel) x = x.div(1e16)

        if (x.lt(1)) return x

        if (player.grasshop >= 7) x = x.pow(1.25)

        if (inChal(5)) x = x.root(2)

        return x
    },
    rangeCut: _=>50+upgEffect('grass',4,0)+upgEffect('perk',4,0),
    autoCut: _=>5-upgEffect('auto',0,0)-upgEffect('plat',0,0)-starTreeEff('progress',3,0),
    level: {
        req(i) {
            i = E(i).scale(player.decel?300:700,2,0).scale(tmp.level.scale1,2,0)

            if (inChal(0) || inChal(7)) i = i.mul(3)
            
            let x = Decimal.pow(2.7,i.pow(0.75)).mul(50)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(50)
            if (x.lt(1)) return 0
            x = x.log(2.7).root(0.75)

            if (inChal(0) || inChal(7)) x = x.div(3)

            return Math.floor(x.scale(tmp.level.scale1,2,0,true).scale(player.decel?300:700,2,0,true).toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        perk() {
            let x = player.level

            return x
        },
    },
    tier: {
        req(i) {
            let pow = player.lowGH <= 24 ? 1.15 : 1.2
            let x = Decimal.pow(3,i**pow).mul(100)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(100)
            if (x.lt(1)) return 0
            let pow = player.lowGH <= 24 ? 1.15 : 1.2
            x = x.log(3).root(pow)

            return Math.floor(x.toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
        mult(i) {
            let base = 2 + upgEffect('crystal',5,0) + (tmp.chargeEff[5]||0)
            let x = Decimal.pow(base,i)

            return x
        },
    },
    astral: {
        req(i) {
            let x = Decimal.pow(3,i).mul(100)

            return x.ceil()
        },
        bulk(i) {
            let x = i.div(100)
            if (x.lt(1)) return 0
            x = x.log(3)

            return Math.floor(x.toNumber()+1)
        },
        cur(i) {
            return i > 0 ? this.req(i-1) : E(0) 
        },
    },
    spGain() {
        let x = E(1)

        if (player.grassskip>=2) x = x.add(getGSEffect(1,0))

        x = x.mul(starTreeEff('progress',2)*starTreeEff('progress',5))

        return x
    },
    checkCutting() {
        if (player.xp.gte(tmp.level.next)) {
            player.level = Math.max(player.level, tmp.level.bulk)
        }
        if (player.tp.gte(tmp.tier.next)) {
            player.tier = Math.max(player.tier, tmp.tier.bulk)
        }
        if (player.sp.gte(tmp.astral.next)) {
            player.astral = Math.max(player.astral, tmp.astral.bulk)
        }
    }, 
}

el.update.main = _=>{
    let g = player.decel ? player.aGrass : player.grass

    tmp.el.grassAmt.setHTML(g.format(0))
    tmp.el.grassGain.setHTML(tmp.autoCutUnlocked ? formatGain(g,tmp.grassGain.div(tmp.autocut).mul(tmp.autocutBonus).mul(tmp.autocutAmt)) : "")

    let level_unl = !inSpace()
    tmp.el.level.setDisplay(level_unl)
    if (level_unl) {
        tmp.el.level_top_bar.changeStyle("width",tmp.level.percent*100+"%")
        tmp.el.level_top_info.setHTML(`Level <b class="cyan">${format(player.level,0)}</b> (${formatPercent(tmp.level.percent)})`)
    }

    let tier_unl = player.pTimes > 0 && !inSpace()
    tmp.el.tier.setDisplay(tier_unl)
    if (tier_unl) {
        tmp.el.tier_top_bar.changeStyle("width",tmp.tier.percent*100+"%")
        tmp.el.tier_top_info.setHTML(`Tier <b class="yellow">${format(player.tier,0)}</b> (${formatPercent(tmp.tier.percent)})`)
    }

    let astral_unl = player.gTimes > 0 && inSpace()
    tmp.el.astral.setDisplay(astral_unl)
    if (astral_unl) {
        tmp.el.astral_top_bar.changeStyle("width",tmp.astral.percent*100+"%")
        tmp.el.astral_top_info.setHTML(`Astral <b class="magenta">${format(player.astral,0)}</b> (${formatPercent(tmp.astral.percent)})`)
    }

    if (mapID == 'g') {
        tmp.el.level_amt.setTxt(format(player.level,0))
        tmp.el.level_progress.setTxt(tmp.level.progress.format(0)+" / "+tmp.level.next.sub(tmp.level.cur).format(0)+" XP")
        tmp.el.level_bar.changeStyle("width",tmp.level.percent*100+"%")
        tmp.el.level_cut.setTxt("+"+tmp.XPGain.format(1)+" XP/cut")

        tmp.el.tier_div.setDisplay(tier_unl)
        if (tier_unl) {
            tmp.el.tier_amt.setTxt(format(player.tier,0))
            tmp.el.tier_progress.setTxt(tmp.tier.progress.format(0)+" / "+tmp.tier.next.sub(tmp.tier.cur).format(0)+" TP")
            tmp.el.tier_bar.changeStyle("width",tmp.tier.percent*100+"%")
            tmp.el.tier_cut.setTxt("+"+tmp.TPGain.format(1)+" TP/cut")
            tmp.el.tier_mult.setTxt(formatMult(tmp.tier.mult,0)+" → "+formatMult(MAIN.tier.mult(player.tier+1),0)+" multiplier")
        }

        astral_unl = player.gTimes > 0
        tmp.el.astral_div.setDisplay(astral_unl)
        if (astral_unl) {
            tmp.el.astral_amt.setTxt(format(player.astral,0))
            tmp.el.astral_progress.setTxt(tmp.astral.progress.format(0)+" / "+tmp.astral.next.sub(tmp.astral.cur).format(0)+" SP")
            tmp.el.astral_bar.changeStyle("width",tmp.astral.percent*100+"%")
            tmp.el.astral_cut.setTxt("+"+tmp.SPGain.format(1)+" SP/cut")
        }
    }

    tmp.el.main_app.changeStyle('background-color',inSpace() ? "#fff1" : "#fff2")
    document.body.style.backgroundColor = inSpace() ? "#0A001E" : "#0052af"
}

tmp_update.push(_=>{
    tmp.platCutAmt = hasStarTree('auto',3)
    tmp.moonstoneCutAmt = hasStarTree('auto',5)

    tmp.grassCap = MAIN.grassCap()
    tmp.grassSpawn = MAIN.grassSpawn()
    tmp.rangeCut = MAIN.rangeCut()
    tmp.autocut = MAIN.autoCut()

    tmp.autoCutUnlocked = hasUpgrade('auto',0)

    tmp.autocutBonus = upgEffect('auto',1)
    tmp.autocutAmt = 1+upgEffect('auto',2,0)+starTreeEff('progress',1,0)
    tmp.spawnAmt = 1+upgEffect('perk',5,0)+upgEffect('crystal',4,0)

    tmp.grassGain = MAIN.grassGain()
    tmp.XPGain = MAIN.xpGain()
    tmp.TPGain = MAIN.tpGain()
    tmp.SPGain = MAIN.spGain()

    tmp.perks = MAIN.level.perk()
    tmp.perkUnspent = Math.max(player.maxPerk-player.spentPerk,0)

    let lvl = player.level

    tmp.level.scale1 = player.decel?2:200
    tmp.level.scale1 += upgEffect('aGrass',5,0)+upgEffect('ap',5,0)
    tmp.level.scale1 *= (tmp.chargeEff[2]||1) * starTreeEff('progress',4)

    tmp.level.next = MAIN.level.req(lvl)
    tmp.level.bulk = MAIN.level.bulk(player.xp)
    tmp.level.cur = MAIN.level.cur(lvl)
    tmp.level.progress = player.xp.sub(tmp.level.cur).max(0).min(tmp.level.next)
    tmp.level.percent = tmp.level.progress.div(tmp.level.next.sub(tmp.level.cur)).max(0).min(1).toNumber()

    let t = player.tier

    tmp.tier.next = MAIN.tier.req(t)
    tmp.tier.bulk = MAIN.tier.bulk(player.tp)
    tmp.tier.cur = MAIN.tier.cur(t)
    tmp.tier.progress = player.tp.sub(tmp.tier.cur).max(0).min(tmp.tier.next)
    tmp.tier.percent = tmp.tier.progress.div(tmp.tier.next.sub(tmp.tier.cur)).max(0).min(1).toNumber()
    tmp.tier.mult = MAIN.tier.mult(t)

    let a = player.astral

    tmp.astral.next = MAIN.astral.req(a)
    tmp.astral.bulk = MAIN.astral.bulk(player.sp)
    tmp.astral.cur = MAIN.astral.cur(a)
    tmp.astral.progress = player.sp.sub(tmp.astral.cur).max(0).min(tmp.astral.next)
    tmp.astral.percent = tmp.astral.progress.div(tmp.astral.next.sub(tmp.astral.cur)).max(0).min(1).toNumber()

    tmp.platGain = 1
    if (player.grasshop >= 4) tmp.platGain += getGHEffect(3)

    tmp.platGain *= upgEffect('oil',4,1) * getASEff('plat') * upgEffect('moonstone',3)
    tmp.platGain = Math.ceil(tmp.platGain)

    tmp.platChance = 0.005
    if (player.grasshop >= 6) tmp.platChance *= 2
})

let shiftDown = false
window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) {
		shiftDown = true;
		return
	}
	switch (event.key) {
		case "p":
			if (shiftDown) RESET.rocket_part.reset();
			else if (player.decel) RESET.ap.reset();
			else RESET.pp.reset();
			break;
		case "c":
			if (player.decel) RESET.oil.reset();
			else RESET.crystal.reset();
			break;
		case "g":
			if (shiftDown) RESET.gal.reset();
			else RESET.gh.reset();
			break;
		case "s":
			if (shiftDown) RESET.steel.reset();
			break;
		case "f":
			ROCKET.create()
			break;
	}
}, false);
window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) {
		shiftDown = false;
		return
	}
	switch (event.key) {
		case "p":
			if (player.decel) RESET.ap.reset();
			else RESET.pp.reset();
			break;
		case "c":
			if (player.decel) RESET.oil.reset();
			else RESET.crystal.reset();
			break;
		case "g":
			RESET.gh.reset();
			break;
		case "s":
			RESET.steel.reset();
			break;
		case "f":
			RESET.steel.reset();
			break;
	}
}, false);
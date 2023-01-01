const RF_COST_POW = 2

const ROCKET = {
	cost(rf,mul) {
		return E(rf).div(tmp.rf_gain_mult).add(1).pow(RF_COST_POW).mul(tmp.rf_base_mult).mul(mul)
	},
	bulk(x,mul) {
		let b = x.div(mul).div(tmp.rf_base_mult).root(RF_COST_POW).sub(1).mul(tmp.rf_gain_mult).floor()
		if (b.lt(0)) return 0
		return b.toNumber()+1
	},
	create() {
		let rf = player.rocket.total_fp
		let b = tmp.rf_bulk

		if (b>rf) {
			player.rocket.total_fp = b
			player.rocket.amount += b-rf

			player.chargeRate = player.chargeRate.sub(ROCKET.cost(b,1e20).sub(ROCKET.cost(rf,1e20))).max(0)
			player.aRes.oil = player.aRes.oil.sub(ROCKET.cost(b,100).sub(ROCKET.cost(rf,100))).max(0)

			updateRocketTemp()
		}
	},
}

UPGS.rocket = {
	title: "Refinery Upgrades",

	unl: _=>true,

	underDesc: _=>getUpgResTitle('rf'),

	ctn: [
		//Tier 1
		{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Grass",
			desc: `Increase grass gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Grass'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Levels",
			desc: `Increase XP gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Icons/XP'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Tiers",
			desc: `Increase TP gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Icons/TP'],
			
			cost: i => 2,
			bulk: i => Math.floor(i/2),

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Prestiges",
			desc: `Increase PP gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Prestige'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Crystals",
			desc: `Increase crystal gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Crystal'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Foundry",
			desc: `Increase steel gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Steel'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Charge",
			desc: `Increase charge rate by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Icons/Charge'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Anonymity",
			desc: `Increase AP gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Anonymity'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			max: 50,

			costOnce: true,

			title: "Rocket Fueled Pumpjacks",
			desc: `Increase oil gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Oil'],
			
			cost: i => 1,
			bulk: i => i,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},

		//Tier 2
		{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Speed",
			desc: `Increase grow speed by <b class="green">+0.1/s</b> per level.`,

			res: "rf",
			icon: ['Icons/Speed'],
			
			cost: i => 10,
			bulk: i => i/10,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x,1)+"/s",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Levels II",
			desc: `Increase XP gain by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Icons/XP'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Prestiges II",
			desc: `Increase PP gain by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Curr/Prestige'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Foundry II",
			desc: `Increase steel gain by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Curr/Steel'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Charge II",
			desc: `Increase charge rate by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Icons/Charge'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Anonymity II",
			desc: `Increase AP gain by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Curr/Anonymity'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 50,

			costOnce: true,

			title: "Rocket Fueled Pumpjacks II",
			desc: `Increase oil gain by <b class="green">+10%</b> per level.`,

			res: "rf",
			icon: ['Curr/Oil'],
			
			cost: i => 30,
			bulk: i => i/30,

			effect(i) {
				let x = E(i*0.1+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 0),
			tier: 2,

			max: 20,

			title: "Rocket Fueled Luck",
			desc: `Increase Platinum chance by <b class="green">+0.2%</b>.`,

			res: "rf",
			icon: ['Curr/Platinum'],
			
			cost: i => E(2).pow(i).mul(100),
			bulk: i => E(i).div(100).log(2).floor().toNumber() + 1,

			effect(i) {
				return i * 0.002
			},
			effDesc: x => "+"+formatPercent(x),
		},

		//Tier 3
		{
			unl: _ => hasStarTree("progress", 1),
			tier: 3,

			max: 100,

			costOnce: true,

			title: "Rocket Fueled Grass II",
			desc: `Increase grass gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Grass'],
			
			cost: i => 500,
			bulk: i => i/500,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 1),
			tier: 3,

			max: 200,

			costOnce: true,

			title: "Rocket Fueled Foundry III",
			desc: `Increase steel gain by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Curr/Steel'],
			
			cost: i => 200,
			bulk: i => i/200,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			unl: _ => hasStarTree("progress", 1),
			tier: 3,

			max: 200,

			costOnce: true,

			title: "Rocket Fueled Charge III",
			desc: `Increase charge rate by <b class="green">+5%</b> per level.`,

			res: "rf",
			icon: ['Icons/Charge'],
			
			cost: i => 200,
			bulk: i => i/200,

			effect(i) {
				let x = E(i*0.05+1)

				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

let ROCKET_PART = {
	can() {
		let req = tmp.rp_req
		return player.steel.gte(req.steel) && player.rocket.total_fp >= req.rf && (player.rocket.part < 10 || this.upgraded())
	},
	req(p = player.rocket.part) {
		if (this.upgraded()) {
			return {
				steel: E(1e5).pow((p+1)**1.25).mul(1e18),
				rf: E(10).pow(p+1)
			}
		} else {
			return {
				steel: E(100).pow(Math.log10(p+1)**1.25).mul(1e21),
				rf: E(10).add(1).mul(p)
			}
		}
	},
	upgraded: _ => hasStarTree("progress", 10),

	m_gain() {
		if (this.upgraded() && player.rocket.part) return 10 ** (player.rocket.part - 1)
		return 1
	}
}

RESET.rocket_part = {
	unl: _=> hasUpgrade('factory',6),

	req: _=>true,
	reqDesc: _=>``,

	resetDesc: `<span style="font-size: 14px">Reset everything Steelie does, and so Steel, Foundry, Charger upgrades, Anti-Realm, and total Fuel. You'll gain 1 Rocket Part and Momentum, and reset the cost of Rocket Fuels.</span>`,
	resetGain: _=> player.rocket.part == 10 && !ROCKET_PART.upgraded() ? `<span class="pink">${galUnlocked() ? "Maxed!" : "Do a Galactic reset immediately!"}</span>` :`<span style="font-size: 14px">
		<b class="lightgray">Steel</b><br>
		<span class="${player.steel.gte(tmp.rp_req.steel)?"green":"red"}">${player.steel.format(0)} / ${tmp.rp_req.steel.format(0)}</span><br><br>
		<b class="lightblue">Total Rocket Fuel</b><br>
		<span class="${player.rocket.total_fp >= tmp.rp_req.rf?"green":"red"}">${format(player.rocket.total_fp,0)} / ${format(tmp.rp_req.rf,0)}</span><br><br>
		You have created ${format(player.rocket.part,0)} Rocket Parts
	</span>`,
	hotkey: `Shift+P`,

	title: `Rocket Part`,
	resetBtn: `Create Rocket Part`,

	reset(force=false) {
		if (ROCKET_PART.can() || force) {
			if (!force) {
				player.rocket.part++
				player.rocket.momentum += ROCKET_PART.m_gain()
			}

			updateTemp()

			this.doReset()
		}
	},

	doReset(order="rp") {
		player.rocket.total_fp = 0

		if (!hasStarTree("qol", 8)) {
			player.steel = E(0)
			player.chargeRate = E(0)
			delete player.upgs.gen[2]
			delete player.upgs.gen[3]
			delete player.upgs.gen[4]
			resetUpgrades('foundry')
		}
		resetAntiRealm()

		RESET.gh.doReset(order)
	},
}

UPGS.momentum = {
	title: "Momentum Upgrades",

	unl: _=>hasUpgrade("factory",6)||hasStarTree("progress",10),
	req: _=>player.rocket.part>0||hasStarTree("progress",10),
	reqDesc: _=>`Get a Rocket Part to unlock.`,

	underDesc: _=>getUpgResTitle('momentum')+(tmp.m_prod > 0 ? " <span class='smallAmt'>"+formatGain(E(player.rocket.momentum),ROCKET_PART.m_gain()*tmp.m_prod)+"</span>" : ""),

    autoUnl: _=>hasStarTree('auto',2),

	ctn: [
		{
			costOnce: true,

			title: "Grass is Life",
			desc: `Multiply grass gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Grass'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Gotta Grow Fast",
			desc: `Grass grows 3x faster.`,

			res: "momentum",
			icon: ['Icons/Speed'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Gas Gas Gas",
			desc: `Multiply XP gain by 3x.`,

			res: "momentum",
			icon: ['Icons/XP'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "In Tiers",
			desc: `Multiply TP gain by 3x.`,

			res: "momentum",
			icon: ['Icons/TP'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Popular",
			desc: `Multiply PP gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Prestige'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Shine Bright",
			desc: `Multiply Crystal gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Crystal'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Steel Going?",
			desc: `Multiply steel gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Steel'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Powerful",
			desc: `Multiply charge rate by 3x.`,

			res: "momentum",
			icon: ['Icons/Charge'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Quickly Forgettable",
			desc: `Multiply AP gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Anonymity'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			costOnce: true,

			title: "Fracking",
			desc: `Multiply oil gain by 3x.`,

			res: "momentum",
			icon: ['Curr/Oil'],
			
			cost: i => 1,
			bulk: i => 1,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			title: "Unnatural Momentum",
			desc: `<b class="green">+1</b> to Unnatural Healing.`,

			res: "momentum",
			icon: ['Curr/UnnaturalGrass'],
			
			unl: _ => ROCKET_PART.upgraded(),
			cost: i => EINF,
			bulk: i => 0,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},{
			title: "It Doesn't Matter",
			desc: `<b class="green">Double</b> Dark Matters.`,

			res: "momentum",
			icon: ['Curr/DarkMatter'],
			
			unl: _ => ROCKET_PART.upgraded(),
			cost: i => EINF,
			bulk: i => 0,

			effect(i) {
				let x = i*2+1

				return x
			},
			effDesc: x => format(x)+"x",
		},
	],
}

el.update.rocket = _=>{
	if (mapID == "rf") {
		tmp.el.refinery_div.setDisplay(hasUpgrade('factory', 5))

		for (let i = 0; i < 2; i++) {
			let rc = tmp.el["rf_cost"+i]
			let res = [player.chargeRate,player.aRes.oil][i]
			let cost = tmp.rf_cost[i]

			rc.setTxt(res.format(0)+" / "+cost.format(0))
			rc.setClasses({[res.gte(cost)?"green":"red"]: true})
		}

		tmp.el.rf_craft_bulk.setTxt("(F) Craft to "+format(Math.max(tmp.rf_bulk-player.rocket.total_fp,0),0)+" Rocket Fuel")
		tmp.el.rf_craft_bulk.setClasses({locked: tmp.rf_bulk<=player.rocket.total_fp })

		tmp.el.reset_btn_rocket_part.setClasses({locked: !ROCKET_PART.can()})
	}
}

function updateRocketTemp() {
	//Rocket Fuel
	let rp_scale = 0.5
	rp_scale *= Math.max(1 - starTreeEff("progress", 12, 1), 0)
	tmp.rf_base_mult = E(player.rocket.part).mul(rp_scale).add(1)

	tmp.rf_gain_mult = 1
	tmp.rf_gain_mult += getGSEffect(3, 0)
	tmp.rf_gain_mult += getAstralEff('rf', 0)
	tmp.rf_gain_mult += upgEffect('moonstone', 1, 0)


	let rf = player.rocket.total_fp
	tmp.rf_cost = [ROCKET.cost(rf, 1e20), ROCKET.cost(rf, 100)]
	tmp.rf_bulk = Math.min(ROCKET.bulk(player.chargeRate, 1e20), ROCKET.bulk(player.aRes.oil, 100))

	//Rocket Part
	tmp.rp_req = ROCKET_PART.req()
	tmp.m_prod = ROCKET_PART.upgraded() ? 0.01 : 0
}

tmp_update.push(_=>{
	updateRocketTemp()
})
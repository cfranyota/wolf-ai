export const CALL_SCRIPTS = {
  zillow: {
    label: 'Zillow / Inbound Buyer',
    goal: 'Qualify fast with LPMAMA → book buyer consult',
    opening: [
      "Thanks for reaching out! I saw you were looking at [property]. Are you still interested in that area, or was that just one of a few you're keeping an eye on?",
      "Quick question before I pull anything up — are you looking to buy in the next 60 to 90 days, or still in early research mode?"
    ],
    questions: [
      "What areas or neighborhoods are you focused on? (Location)",
      "Do you have a price range in mind? (Price)",
      "What's driving the move right now — what made this the right time? (Motivation)",
      "Are you currently working with another agent? (Agent)",
      "Have you had a chance to get pre-approved yet? (Mortgage)",
      "Are you available this week to sit down and go through everything? (Appointment)"
    ],
    objections: [
      { q: "Just browsing / not serious yet", a: "Totally get it. If the perfect home hit the market tomorrow at the right price, would you be in a position to move on it?" },
      { q: "Already have an agent", a: "Totally fine. Are you locked in with them, or are you still open to options?" },
      { q: "Not pre-approved", a: "Getting pre-approved doesn't commit you to anything — it just tells you your real buying power. What's been holding that up?" },
      { q: "Not ready to buy", a: "That makes sense. What would have to happen for you to feel ready?" }
    ]
  },
  fthb: {
    label: 'First-Time Home Buyer',
    goal: 'Build trust → start pre-approval → book consult',
    opening: [
      "So you're looking at buying your first home — that's exciting. Where are you in the process right now?",
      "Before I pull anything up, I want to make sure I understand what you're looking for. Can I ask a couple of quick questions?"
    ],
    questions: [
      "What's your timeline for wanting to be in a home?",
      "Have you had a chance to talk to a lender about what you qualify for?",
      "What area or neighborhood are you picturing yourself in?",
      "Is this just you, or are you buying with someone else?",
      "What does your ideal home look like — size, bedrooms, must-haves?"
    ],
    objections: [
      { q: "We don't know if we can afford it", a: "That's exactly why we start with a lender — most first-timers are surprised by what they actually qualify for." },
      { q: "We want to wait", a: "What's the thing you're waiting on? Let's figure out if that's actually holding you back." },
      { q: "Our rent is cheap — why move?", a: "How much equity are you building where you are right now?" },
      { q: "The market is too expensive", a: "What would the market have to look like for it to make sense for you?" }
    ]
  },
  open_house: {
    label: 'Open House Lead',
    goal: 'Qualify → determine agent status → book next step',
    opening: [
      "Welcome! Have you been to many open houses in this area, or is this one of the first?",
      "Are you familiar with the neighborhood, or still exploring different areas?"
    ],
    questions: [
      "What brought you out to look today?",
      "Are you currently working with an agent?",
      "Do you have a home to sell before you buy, or are you free to move?",
      "What's your timeline looking like?",
      "Is there anything about this home that jumps out — good or bad?"
    ],
    objections: [
      { q: "Just looking", a: "Totally fine. What would a home have to do for you to stop looking and start making moves?" },
      { q: "We have an agent", a: "Great. Are they showing you properties, or are you doing most of the searching yourself?" },
      { q: "Not ready", a: "Makes sense. What needs to fall into place first?" }
    ]
  },
  warm_buyer: {
    label: 'Warm Referral (Buyer)',
    goal: 'Quick rapport → qualify → set meeting fast',
    opening: [
      "[Referral name] mentioned you might be looking — I figured I'd reach out and see what the situation is.",
      "I don't want to assume anything — are you actively looking or just starting to think about it?"
    ],
    questions: [
      "What's your timeline for wanting to be in something?",
      "Do you have a price range in mind?",
      "Have you started the pre-approval process yet?",
      "What areas are you open to?",
      "What does the ideal next home look like for you?"
    ],
    objections: [
      { q: "Not ready yet", a: "Totally fine. What needs to happen for you to feel ready?" },
      { q: "Still early stages", a: "That's actually the best time — we can make sure you're set up right before anything hits the market." }
    ]
  },
  buyer: {
    label: 'Buyer',
    goal: 'Re-engage a paused/inactive buyer lead with LPMAMA → book a sit-down',
    sections: [
      {
        label: 'Opening',
        items: [
          "Hey [Prospect Name]?",
          "Hey, this is just [Agent Name] with [Company Name]. I saw you had asked about [Beds] bedroom homes in [City]. Did you end up moving already or are you still waiting?"
        ]
      },
      {
        label: 'Motivation',
        items: [
          "Did you pause the search for a bit or have you been casually looking this whole time?",
          "And why do you want to move?",
          "Who's making the move with you? Partner? Kids? Fur babies?",
          "(if natural, ask for names of family members, then address them by name)"
        ]
      },
      {
        label: 'Location',
        items: [
          "Where are you moving from?",
          "Have you narrowed down what part of [City] you want to move to? Any reason those areas matter to you?",
          "Did you consider [Area] or [Area] at all?",
          "Do you work from home or from an office?"
        ]
      },
      {
        label: 'Price / Property',
        items: [
          "I'm curious, what's not working about your current place that you want to make sure is different when you move?",
          "That's helpful! Tell me a little more about what you want in your new place. Like Bedrooms. Bathrooms. Space. Office. Yard. Kids. Pets. Anything like that.",
          "Have you thought about what monthly payment you and [Spouse or Decision Maker] might be comfortable with?"
        ]
      },
      {
        label: 'Timing',
        items: [
          "I probably should have asked this earlier. Have you thought about timing yet? Like when you'd ideally want to or need to move by?"
        ]
      },
      {
        label: 'Transition',
        items: [
          "That lines up perfectly with what we're talking about.",
          "Most people I talk to are in a similar spot, and what they love about working with me is that I sit down and show them the 3 most important factors to consider before moving in today's market.",
          "Honestly, for some clients, it helps them decide if waiting is smarter.",
          "And for others, it confirms that moving now makes sense.",
          "Would you be open to sitting down so you and your [Spouse or Decision Maker] can decide either way?"
        ]
      },
      {
        label: 'Booking',
        items: [
          "Great! Are you more morning, afternoon, or evening people?",
          "Would today @ [Time] or tomorrow @ [Time] work? And would that work for [Spouse or Decision Maker] too?",
          "We can do a quick 20 to 25 minute sit down. At the office or over a coffee. Do you have a preference?",
          "Zoom works if needed."
        ]
      },
      {
        label: 'Confirm',
        items: [
          "To confirm your email, I have [Prospect's Email].",
          "And what other email should I send the invite to?"
        ]
      },
      {
        label: 'Close',
        items: [
          "And if anything changes, just shoot me a text. Even if we need to push it by a few minutes or reschedule for later in the day. Does that sound good?",
          "I'm excited to meet you. In the meantime, I'll send you a few resources to help & I'll bring physical copies. I'll prepare a full packet for you so you can have them!"
        ]
      }
    ]
  },
  fsbo: {
    label: 'FSBO',
    goal: 'Disarm resistance → build curiosity → set listing appointment',
    opening: [
      "Hey [name], this is Casey with The RISE Group South Bay. I'll be upfront — I'm a Realtor, and before you hang up, I was hoping to ask you something quick. Would that be okay?",
      "I'm not calling to list your home today — I just had a quick question about the property. Do you have 30 seconds?"
    ],
    questions: [
      "How long have you been on the market so far?",
      "What made you decide to sell it yourself instead of using an agent?",
      "What's your timeline for getting this done?",
      "Have you had any showings yet? Any serious offers?",
      "What would you do if it didn't sell by your deadline?"
    ],
    objections: [
      { q: "I don't want to pay commission", a: "Only 2% of FSBOs sell to a non-agent buyer. 98% end up listing anyway — most for less than market value. Does the math actually work out?" },
      { q: "I already have a buyer", a: "Great. Have you talked to a real estate attorney about the contracts and disclosures?" },
      { q: "I've done this before", a: "Nice. And when you sell, what are you moving into?" },
      { q: "Not interested", a: "That's fair. Is it more that now isn't the right time, or you just haven't seen a reason yet?" }
    ]
  },
  expired: {
    label: 'Expired Listing',
    goal: 'Earn trust → differentiate from prior agent → set appointment',
    opening: [
      "Hey [name], I know your home was recently on the market and it didn't sell. I'm not going to pretend I know exactly why — but I'd love to ask you one quick question if that's okay.",
      "I took a look at your property and I think I have a sense of what happened. Would it be worth 5 minutes to hear what I'd do differently?"
    ],
    questions: [
      "What do you think stopped it from selling?",
      "What did the agent do — or not do — that frustrated you most?",
      "Are you still motivated to sell, or thinking of taking a break?",
      "What would it take for you to feel confident trying again?",
      "If I could show you specifically what went wrong, would that be worth a conversation?"
    ],
    objections: [
      { q: "I'm done with agents", a: "That's fair. What would an agent have to do differently for you to give it another shot?" },
      { q: "Just reducing the price myself", a: "A price reduction without changing the strategy usually gets the same result. What else is changing?" },
      { q: "The market is slow", a: "Your home sat for [X days]. Most homes in the area sold in [Y days]. What does that tell you?" },
      { q: "Need to think about it", a: "Totally understand. What specifically are you weighing?" }
    ]
  },
  circle: {
    label: 'Circle Prospecting',
    goal: 'Pattern interrupt → spark curiosity → pivot to seller conversation',
    opening: [
      "Hey [name], this is Casey with The RISE Group South Bay. [Address] just sold in your neighborhood — quick question, have you ever thought about what your place might be worth today?",
      "I know this is a bit out of the blue — I just sold a home nearby and had one quick question. Do you have 30 seconds?"
    ],
    questions: [
      "Have you thought about selling at any point, or planning to stay long-term?",
      "Do you have any idea what homes are actually selling for around you right now?",
      "How long have you been in the home?",
      "If someone handed you a great offer tomorrow, would you consider it?",
      "What would have to happen for selling to make sense for you?"
    ],
    objections: [
      { q: "Not interested in selling", a: "Totally fair. Would it at least be bad to know what it's worth right now — no obligation?" },
      { q: "We just bought", a: "Got it. What made you choose this neighborhood?" },
      { q: "Happy where we are", a: "That's great. Just so you know — if that ever changes, the market right now is really strong for sellers in your area." }
    ]
  },
  absentee: {
    label: 'Absentee Owner',
    goal: 'Explore exit strategy → uncover timeline → book appointment',
    opening: [
      "Hey [name], I'm reaching out about the property you own at [address]. Are you still holding onto that one as a rental, or has the situation changed at all?",
      "I work with a lot of investors and landlords in South Bay. Quick question — have you thought about your exit strategy on that property?"
    ],
    questions: [
      "How long have you owned the property?",
      "Is it currently rented, or sitting vacant?",
      "Are you getting the return you expected when you bought it?",
      "Have you thought about pulling that equity out and repositioning it?",
      "What would have to happen for selling to make sense for you?"
    ],
    objections: [
      { q: "I don't want to sell", a: "Makes sense. Is it more about the cash flow or the long-term appreciation play?" },
      { q: "I'll lose too much to taxes", a: "Have you talked to your CPA about a 1031 exchange? It might completely change the math." },
      { q: "The tenant has a lease", a: "When does that expire? That's usually the natural time to evaluate options." }
    ]
  },
  probate: {
    label: 'Probate / Inherited',
    goal: 'Lead with empathy → simplify the process → set appointment',
    opening: [
      "Hey [name], I know this might be a sensitive time and I really appreciate you taking my call. I specialize in helping families navigate the sale of inherited properties — I wanted to see if there's anything I could help simplify.",
      "I'm not here to pressure you in any way. I just know dealing with a property on top of everything else can be overwhelming, and I've helped a lot of families get through it smoothly."
    ],
    questions: [
      "Where are you in the process — has the estate been through probate yet?",
      "Is the property currently occupied, or is it vacant?",
      "Are there other family members involved in the decision?",
      "What's your ideal timeline for resolving the property?",
      "Have you had it appraised, or do you have a sense of what it's worth?"
    ],
    objections: [
      { q: "We're not ready to decide", a: "Completely understandable. Would it help to at least know what it's worth so you have that when you are ready?" },
      { q: "We might keep it", a: "Have you thought through whether the estate would benefit more from a sale or holding it long-term?" },
      { q: "Another agent already contacted us", a: "That's fine. What matters is working with someone who specializes in this. What questions do you have?" }
    ]
  },
  frbo: {
    label: 'For Rent By Owner',
    goal: 'Explore investor exit plan → introduce selling → book appointment',
    opening: [
      "Hey [name], I saw your rental listing at [address]. Are you self-managing the property, or do you have a property manager?",
      "I work with a lot of landlords in South Bay. Quick question — are you planning to hold that one long-term, or have you thought about your options?"
    ],
    questions: [
      "How long have you owned the property?",
      "Are you getting the return you were expecting?",
      "Do you know what the property is worth in today's market?",
      "Have you ever thought about selling and moving that equity somewhere else?",
      "Is the plan to keep renting indefinitely, or is there an end game?"
    ],
    objections: [
      { q: "I like the cash flow", a: "Makes sense. Is it the cash flow or the appreciation that's the bigger play for you?" },
      { q: "Capital gains will kill me", a: "Have you looked at a 1031 exchange? You could defer all of that and roll into something bigger." },
      { q: "I'll just re-rent it", a: "Totally. Do you know what it would sell for today versus what you paid?" }
    ]
  },
  downsizer: {
    label: 'Downsizer',
    goal: 'Uncover timeline and motivation → book listing consultation',
    opening: [
      "Hey [name], I specialize in helping people in South Bay make the transition from a larger home to something more manageable. Is that something that's been on your mind?",
      "I know you've been in your home a long time. Are you at a stage where you've thought about simplifying things a bit?"
    ],
    questions: [
      "How long have you been in the home?",
      "What would the ideal next chapter look like for you?",
      "Are you thinking smaller in the same area, or open to relocating?",
      "Do you have a sense of your timeline?",
      "Have you looked at what your home is worth in today's market?"
    ],
    objections: [
      { q: "We love our home, not ready", a: "Totally fair. Is it more about the home itself, or the idea of going through the whole process?" },
      { q: "The market isn't right", a: "Actually, downsizers tend to do really well right now — you sell high, buy smaller. Want me to show you the numbers?" },
      { q: "We don't know where we'd go", a: "That's actually where we start — figuring out what the next chapter looks like before we do anything." }
    ]
  },
  sell_first: {
    label: 'Sell First Before Buy',
    goal: 'Uncover sell timeline → qualify the buy side → get both sides moving',
    opening: [
      "Hey [Name], Casey here with RISE. I saw you were checking out some listings in the [___] area. I'm curious, are you looking for yourself or just kind of watching what's going on in the market right now?",
      "You know what, that's actually the move — and I work with a lot of buyers in exactly that situation. Before I ask anything about the buy side, I want to understand the sell side first. Have you talked to anyone about what your home is worth today?"
    ],
    questions: [
      "Where are you in the process on your current home — have you talked to an agent yet, or just starting to think about it?",
      "Do you have a sense of what your home is worth and what you'd walk away with after the sale?",
      "What's your timeline — when would you ideally like to be in the next home?",
      "Have you already been pre-approved on the buy side, or is that still pending the sale?",
      "Is there a specific area or type of home you're targeting for the purchase?"
    ],
    objections: [
      { q: "We can't buy until we sell", a: "Totally makes sense. If we could get your home under contract in 30-45 days, would you want to start looking now so you're not scrambling when it closes?" },
      { q: "What if we sell and can't find anything?", a: "Great question. We can negotiate a rent-back or extended close on your sale so you have time to find the right home." },
      { q: "The timing feels too complicated", a: "It sounds complicated but it's actually very manageable when you have someone coordinating both sides. That's what I do every day." },
      { q: "We need to wait until the house sells", a: "Makes sense. What if we got you fully prepared so that the moment it sells, you're already ahead of the other buyers?" }
    ]
  },
  dead_zillow: {
    label: 'Dead Zillow Lead (Re-Engage)',
    goal: 'Re-engage a cold lead → find out what changed → requalify and book next step',
    opening: [
      "Hey [name], this is Casey Francis with The RISE Group South Bay — we actually connected a while back through Zillow. I know it's been a minute, so no pressure at all — I just wanted to check in and see where things are at for you.",
      "Hey [name], Casey Francis here — you had inquired about a property a while back and I just wanted to reach out with zero expectations. Are you still thinking about buying, or has the situation changed?"
    ],
    questions: [
      "Since we last connected, has anything changed for you — are you still thinking about buying, or life kind of got in the way?",
      "When we spoke before, you were looking in [area] — is that still the target, or has that shifted?",
      "What would have to happen for buying to become a real priority for you right now?",
      "Is it more of a timing thing, a financing thing, or just haven't found the right home yet?",
      "If I could show you a couple of homes that actually match what you were looking for — would it be worth a quick conversation?"
    ],
    objections: [
      { q: "I forgot I even reached out", a: "Ha, no worries at all. Things get busy. The reason I'm calling is the market has shifted a bit and I wanted to make sure you had current information." },
      { q: "We decided not to buy", a: "Completely fine. Was it more of a timing thing or did something specific change?" },
      { q: "Still looking, just taking our time", a: "That's fair. What's the one thing that would make you say yes if the right home showed up?" },
      { q: "Already bought / working with someone", a: "That's great — congratulations! And if you ever need anything down the road, I hope you'll keep me in mind." }
    ]
  },
  warm_seller: {
    label: 'Warm Referral (Seller)',
    goal: 'Qualify timeline and motivation → book listing appointment fast',
    opening: [
      "[Referral name] mentioned you might be thinking about selling — I wanted to reach out and see where you're at.",
      "I don't want to assume anything — are you seriously considering listing, or still in the early thinking stages?"
    ],
    questions: [
      "What's your timeline for wanting to get on the market?",
      "Do you have a sense of what you're hoping to net from the sale?",
      "Where are you planning to go when you sell?",
      "Have you made any updates to the home recently?",
      "Have you looked at comps in the area lately?"
    ],
    objections: [
      { q: "Not quite ready yet", a: "What needs to happen to make you feel ready?" },
      { q: "Waiting for the market to improve", a: "What would the market have to look like for you to feel good about listing?" },
      { q: "Need to sell to buy", a: "We can actually structure that so you're not in a tough spot. Want to talk through how?" }
    ]
  }
};

export const STYLE_SCRIPTS = {
  nepq: {
    zillow: {
      goal: 'Surface the real pain behind the search — uncover timeline pressure — earn the appointment',
      sections: [
        { label: 'Connection', items: [
          "Thanks for reaching out. Before I pull anything up — what specifically caught your eye on that property? Was it the location, the price, or something else?",
          "I don't want to assume anything about where you're at. Can I ask a couple of quick questions first?",
        ]},
        { label: 'Situation', items: [
          "How long have you been searching in that area?",
          "Are you currently working with another agent, or reaching out on your own?",
          "Have you connected with a lender yet, or is that still something you're figuring out?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the biggest challenge in the search so far?",
          "When you say you've been looking for a while — what's been the main thing that hasn't felt right?",
          "Hold on — when you said [blank], what did you mean by that exactly?",
        ]},
        { label: 'Consequence', items: [
          "If you're still searching six months from now, what does that mean for you?",
          "When you say the timing isn't quite right — what does that do to your situation if it stays that way?",
          "How long can you realistically keep looking before something has to change?",
        ]},
        { label: 'Solution Awareness', items: [
          "What would it actually mean for you to be in the right home by [their timeline]?",
          "If we could narrow this down and get you into something that actually fits — would it be worth an hour this week to map that out?",
        ]},
      ]
    },
    fthb: {
      goal: 'Normalize fear — surface the cost of waiting — move toward pre-approval and consult',
      sections: [
        { label: 'Connection', items: [
          "So you're looking at buying your first home — where are you mentally with it right now — excited, nervous, somewhere in between?",
          "Before we talk about anything specific, what's driving this for you right now?",
        ]},
        { label: 'Situation', items: [
          "Have you had a chance to talk to a lender yet to see what you'd actually qualify for?",
          "What area or neighborhood have you been picturing yourself in?",
          "Is this just you, or are you buying with a partner?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the biggest thing holding you back from moving forward?",
          "When you say you're not sure if you can afford it — is that based on a number you've run, or more of a gut feeling?",
          "Just so I understand — when you say you're not ready, what does ready actually look like for you?",
        ]},
        { label: 'Consequence', items: [
          "If you're still renting a year from now, what does that actually cost you — financially and otherwise?",
          "What would be different about your situation if you found out you could buy today?",
        ]},
        { label: 'Solution Awareness', items: [
          "What would it mean for you to have your own place by the end of the year?",
          "Would it make sense to at least get a clear picture of your numbers before deciding? That way you're working with facts, not guesses.",
        ]},
      ]
    },
    open_house: {
      goal: 'Qualify seriousness — uncover pain — determine agent status — book next step',
      sections: [
        { label: 'Connection', items: [
          "Have you been to a lot of open houses in this area, or is this one of the first?",
          "What brought you out today — is there something specific about this home or the area you're trying to figure out?",
        ]},
        { label: 'Situation', items: [
          "Are you currently working with an agent?",
          "Do you have a home to sell before you buy, or are you free to move?",
          "What's your timeline — actively trying to make something happen, or more of an early explore?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the main thing that's made the search feel hard so far?",
          "When you say you want to wait and see — what specifically are you waiting on? What would have to happen?",
        ]},
        { label: 'Consequence', items: [
          "If you're still looking six months from now, is that okay or does something have to move?",
          "What happens if the right home comes up and you're not ready to act on it?",
        ]},
        { label: 'Solution Awareness', items: [
          "Would it make sense to sit down this week so I can show you exactly what's available and what the process looks like?",
        ]},
      ]
    },
    warm_buyer: {
      goal: 'Confirm needs quickly — uncover sticking points — book meeting fast',
      sections: [
        { label: 'Connection', items: [
          "[Referral name] mentioned you might be looking — I figured I'd reach out and see what the situation actually is. No pressure.",
          "I don't want to assume anything. Are you seriously looking, or still just starting to think about it?",
        ]},
        { label: 'Situation', items: [
          "What's your real timeline for wanting to be in something?",
          "Have you started the pre-approval process at all?",
          "What area or type of home are you focused on?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the main sticking point so far — is it the market, the financing, or something else?",
          "You mentioned you talked to a lender — what did they tell you, and how did that land for you?",
        ]},
        { label: 'Solution Awareness', items: [
          "If we could get you into the right home by [timeline] — what does that change for you?",
          "Would it be worth getting together this week so I can show you exactly where the market is and what's realistic?",
        ]},
      ]
    },
    fsbo: {
      goal: 'Disarm with curiosity — surface hidden pain — earn the listing conversation',
      sections: [
        { label: 'Connection', items: [
          "I'll be upfront — I saw your property is for sale. I'm not calling to list it today. I was just curious — what made you decide to go the FSBO route?",
          "Can I ask a couple of questions — not to sell you anything, just to understand where you're at?",
        ]},
        { label: 'Situation', items: [
          "How long have you been on the market so far?",
          "What kind of activity are you getting — showings, calls, real interest?",
          "What's your timeline for getting this done?",
        ]},
        { label: 'Problem Awareness', items: [
          "When you say you've had showings — are you getting serious buyers, or more curious tire kickers?",
          "What's been harder about this than you expected?",
          "When you say you want to try it yourself first — what's the plan if you don't get the activity you're hoping for?",
        ]},
        { label: 'Consequence', items: [
          "If it doesn't sell by [their deadline] — what does that do to your plans?",
          "Have you looked at what FSBOs typically net compared to listed homes in this area?",
        ]},
        { label: 'Permission', items: [
          "If I could show you a way to get more exposure and net the same or more after commission — would that be worth 20 minutes?",
          "I'm not asking you to list today. I'm just asking if it would be a bad idea to at least see the numbers.",
        ]},
      ]
    },
    expired: {
      goal: 'Acknowledge frustration — surface what went wrong — differentiate — earn the relisting',
      sections: [
        { label: 'Connection', items: [
          "I know your home was on the market recently and it didn't sell. I'm not going to pretend I know exactly why — but I was curious if you'd be open to a quick question.",
          "I'm not going to pitch you right now. I actually just want to understand what happened, if you're open to sharing.",
        ]},
        { label: 'Situation', items: [
          "From your perspective — what do you think stopped it from selling?",
          "What did the agent do, or not do, that frustrated you most?",
          "Are you still motivated to sell, or thinking about taking a break?",
        ]},
        { label: 'Problem Awareness', items: [
          "When you say the agent wasn't doing enough — what specifically were you hoping for that you didn't get?",
          "You mentioned you had a bad experience — what specifically happened? I want to make sure we don't go there again.",
        ]},
        { label: 'Consequence', items: [
          "If it sits for another few months without selling — what does that do to your timeline?",
          "What's the cost of leaving it unsold right now — financially and in terms of where you're trying to go?",
        ]},
        { label: 'Solution Awareness', items: [
          "What would have to be different this time for you to feel confident moving forward with another agent?",
          "If I could show you specifically what went wrong and what I'd do differently — would that be worth 30 minutes?",
        ]},
      ]
    },
    circle: {
      goal: 'Pattern interrupt — spark curiosity — uncover motivation — plant the seed',
      sections: [
        { label: 'Connection', items: [
          "[Address] just sold in your neighborhood — quick question, have you ever thought about what your place might be worth today?",
          "I know this is a bit out of the blue — I just sold a home nearby and had one quick question. Do you have 30 seconds?",
        ]},
        { label: 'Situation', items: [
          "Have you thought about selling at any point, or is the plan to stay long-term?",
          "How long have you been in the home?",
          "Do you have any idea what homes are actually selling for around you right now?",
        ]},
        { label: 'Problem Awareness', items: [
          "When you say the market isn't right — what are you seeing or hearing that's giving you that feeling?",
          "What would have to be true about the market for selling to make sense for you?",
        ]},
        { label: 'Consequence', items: [
          "If the market shifts in the next 12 months — how does that affect what you'd net on the sale?",
          "If someone handed you a great offer tomorrow, would you at least consider it?",
        ]},
        { label: 'Solution Awareness', items: [
          "Would it be bad to at least know the number — what your home is worth today — so you can make an informed decision when the time comes?",
          "I can put together a quick market analysis. No obligation — you'd just know where you stand.",
        ]},
      ]
    },
    absentee: {
      goal: 'Uncover exit strategy — surface landlord fatigue or equity opportunity',
      sections: [
        { label: 'Connection', items: [
          "I'm reaching out about the property you own at [address]. Are you still holding that as a rental, or has the situation changed at all?",
          "I work with a lot of investors and landlords in South Bay. Have you thought about your exit strategy on that property?",
        ]},
        { label: 'Situation', items: [
          "How long have you owned it?",
          "Is it currently rented, or sitting vacant?",
          "Are you getting the return you expected when you bought it?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the most challenging part of holding this property — the management, the return, or something else?",
          "When you say the return isn't quite what you expected — is that about the rent, the expenses, or both?",
        ]},
        { label: 'Consequence', items: [
          "If the market shifts over the next couple of years — what does that do to your equity position?",
          "Have you thought about what you'd do with that equity if you did sell — 1031, reposition, or cash out?",
        ]},
        { label: 'Solution Awareness', items: [
          "If I could show you what the property is worth today and what the net looks like — would that be worth a conversation?",
          "I'm not saying sell. I'm just saying knowing the number might change the math on whether holding still makes sense.",
        ]},
      ]
    },
    probate: {
      goal: 'Lead with empathy — simplify the process — reduce overwhelm — earn the appointment',
      sections: [
        { label: 'Empathy First', items: [
          "I know this might be a sensitive time and I really appreciate you taking my call.",
          "I'm not here to add any pressure. I specialize in helping families navigate inherited properties and I just want to make sure you have someone in your corner.",
        ]},
        { label: 'Situation', items: [
          "Where are you in the process right now — has the estate been through probate yet?",
          "Is the property currently occupied, or is it sitting vacant?",
          "Are there other family members involved in the decision, or is it mainly on you?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the hardest part of dealing with the property on top of everything else?",
          "When you say you're not sure what to do with it — is it more the process, the family dynamics, or the financial side?",
        ]},
        { label: 'Consequence', items: [
          "What's the carrying cost on the property right now — taxes, insurance, maintenance?",
          "How long are you able to manage those costs before a decision has to be made?",
        ]},
        { label: 'Solution Awareness', items: [
          "A lot of families I work with just want someone to handle everything so they don't have to think about it. Is that closer to what would help?",
          "Would it help to at least sit down and understand your options? No commitment — you'd just have a clear picture.",
        ]},
      ]
    },
    frbo: {
      goal: 'Explore landlord pain and exit strategy — introduce selling as an option',
      sections: [
        { label: 'Connection', items: [
          "I saw your rental listing at [address]. Are you self-managing that one, or do you have a property manager?",
          "I work with a lot of landlords in South Bay. Are you planning to hold that one long-term, or have you thought about your options?",
        ]},
        { label: 'Situation', items: [
          "How long have you owned it?",
          "Are you getting the return you were expecting?",
          "Do you know what the property is worth in today's market?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the most frustrating part of being a landlord — the management, the return, the liability?",
          "When you say you want to keep renting it — is the plan to hold indefinitely, or is there an end game at some point?",
        ]},
        { label: 'Consequence', items: [
          "As rents flatten and expenses keep rising — how does the cash flow math change for you?",
          "Do you know what the equity position looks like right now versus what you'd net after a sale?",
        ]},
        { label: 'Solution Awareness', items: [
          "If I ran the numbers for you — value, net proceeds, 1031 options — would that be worth seeing?",
          "I'm not saying sell. I'm just saying informed decisions are better ones.",
        ]},
      ]
    },
    downsizer: {
      goal: 'Validate the season of life — surface the hidden cost of staying — book listing consult',
      sections: [
        { label: 'Connection', items: [
          "I specialize in helping people in South Bay make the transition from a larger home to something more manageable. Is that something that's been on your mind?",
          "I know you've been in the home a long time. Are you at a stage where you've thought about simplifying things?",
        ]},
        { label: 'Situation', items: [
          "How long have you been in the home?",
          "What would the ideal next chapter look like — smaller in the same area, or open to relocating?",
          "Have you looked at what your home is worth in today's market?",
        ]},
        { label: 'Problem Awareness', items: [
          "What's been the main thing keeping you from making the move?",
          "When you say you love your home — is it the home itself, or the idea of going through the whole process that's holding you back?",
          "When you say the market isn't right — what are you seeing or hearing that's giving you that feeling?",
        ]},
        { label: 'Consequence', items: [
          "What does it actually cost you to stay in the bigger home right now — taxes, maintenance, utilities?",
          "If the market shifts and prices soften — what does that do to the equity you've built?",
        ]},
        { label: 'Solution Awareness', items: [
          "What would it mean to have the right-sized home and have that equity working for you?",
          "Would it make sense to at least see the numbers — what the home is worth, what you'd net, and what you could move into?",
        ]},
      ]
    },
    warm_seller: {
      goal: 'Confirm motivation and timeline — uncover concern — book the listing appointment',
      sections: [
        { label: 'Connection', items: [
          "[Referral name] mentioned you might be thinking about selling — I figured I'd reach out and see where you're actually at.",
          "I don't want to assume anything. Are you seriously considering listing, or still in early thinking stages?",
        ]},
        { label: 'Situation', items: [
          "What's your timeline for wanting to get on the market?",
          "Where are you planning to go when you sell?",
          "Do you have a number in mind of what you're hoping to net?",
        ]},
        { label: 'Problem Awareness', items: [
          "You said you're not sure about the price — is that about what you think the home is worth, or what you need to walk away with?",
          "What's your biggest concern about the process right now?",
        ]},
        { label: 'Solution Awareness', items: [
          "If I could show you exactly what the home is worth and what a sale would look like — would it make sense to sit down this week?",
          "I can put together a full market analysis and walk you through the whole process. No pressure — you'd just know exactly where you stand.",
        ]},
      ]
    },
  },

  reverse: {
    zillow: {
      goal: 'Detached authority — earn trust without chasing — let them sell themselves on meeting',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "Hey, I'll be upfront — I'm an agent, and before you hang up, I was hoping to ask you something quick. Would that be okay?",
          "I'm not going to try to sell you on meeting with me today. I just had one quick question — do you have 30 seconds?",
        ]},
        { label: 'Detached Questions', items: [
          "How long have you been searching? I'm just curious.",
          "Are you working with another agent, or are you handling this on your own?",
          "Have you been pre-approved, or are you still figuring out what you're actually working with?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least know exactly what you qualify for before you keep searching?",
          "I get the feeling you're probably not the type of person who wants to miss a great home because of something that could've been handled up front — am I reading that wrong?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if I could find you a home that checked every box, you're probably not going to want to sit down and look at it right now — right?",
          "Most buyers I talk to in your situation say they want to wait. And that's totally fine — I'm just curious what's actually driving that for you.",
        ]},
        { label: 'Detached Close', items: [
          "I'm not going to push you. But if there's any part of you that wants a clearer picture before making any decisions — I can do that in an hour. If not, no hard feelings.",
          "Look, I don't need the business. But if it would actually help you, I'm here.",
        ]},
      ]
    },
    fthb: {
      goal: 'Disarm the pressure — remove the sales feeling — let them come to the decision',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "So you're thinking about buying your first home — and I'm guessing you're expecting me to launch into a pitch right now. I'm going to skip that.",
          "I'm not going to assume you're ready to do anything. Can I ask you one honest question first?",
        ]},
        { label: 'Detached Questions', items: [
          "What's actually driving this for you right now — is it a life thing, a money thing, or both?",
          "Have you talked to a lender yet, or does that still feel like a big step?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least find out what you actually qualify for — even if you're not ready to buy yet?",
          "I'm guessing you've heard horror stories about the process. What specifically are you most worried about?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if you found out you could buy something today, you'd probably still want to wait. Am I wrong about that?",
          "Most first-timers I talk to feel like the whole thing is too complicated — but once they see the actual steps, it's usually a lot simpler than expected.",
        ]},
        { label: 'Detached Close', items: [
          "I'm not going to push you. But if you want clarity on what's actually possible — I can give you that in 45 minutes, no pressure.",
          "Worst case you know your numbers and don't buy. Best case you're in a home by the end of the year.",
        ]},
      ]
    },
    open_house: {
      goal: 'Disarm the open house vibe — earn genuine conversation — determine seriousness',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "Welcome. I'm going to resist the urge to follow you around and hand you my card. One quick question though?",
          "I won't do the whole open house pitch. I'm just genuinely curious — what brought you out today?",
        ]},
        { label: 'Detached Questions', items: [
          "Are you working with another agent, or are you doing this on your own?",
          "Is there a timeline behind the search, or are you more in an explore-and-see mode?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least have someone who knows the area in your corner — even if you're not ready to move yet?",
          "You said you're just browsing — out of curiosity, what would make this go from browsing to real for you?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling you've talked to a few agents and haven't been that impressed. Fair enough. What would someone have to do differently to earn your trust?",
        ]},
        { label: 'Detached Close', items: [
          "I'm not going to chase you. But if there's value in having someone with no agenda helping you navigate this — I'm happy to be that person.",
        ]},
      ]
    },
    warm_buyer: {
      goal: 'High trust — move fast — let them self-qualify into the meeting',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "[Referral name] mentioned you might be looking. I'm not going to assume that means you're ready to do anything — are you?",
          "I'll skip the sales stuff. Tell me honestly — where are you actually at with this?",
        ]},
        { label: 'Detached Questions', items: [
          "What's your real timeline? Not the polite answer — the actual one.",
          "What's been the sticking point so far?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to sit down for an hour and just get clarity on what's actually possible right now?",
          "I'm guessing there's a part of you that's ready and a part that's still on the fence. Which one is winning?",
        ]},
        { label: 'Detached Close', items: [
          "I'll keep it casual — coffee, 45 minutes, no pressure. If it's not the right time, we'll know.",
        ]},
      ]
    },
    fsbo: {
      goal: 'Disarm the FSBO guard completely — earn the appointment without triggering resistance',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "Hey [name], this is Casey with The RISE Group South Bay. I'll be upfront — I'm a Realtor, and before you hang up, I was hoping to ask you something quick. Would that be okay?",
          "I'm not calling to list your home today. I had one honest question about the property. Do you have 30 seconds?",
        ]},
        { label: 'Detached Questions', items: [
          "What made you decide to sell it yourself instead of using an agent?",
          "How's the activity been — serious buyers or mostly curious people?",
          "What's your deadline for getting this done?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least know what FSBOs in this area typically net compared to listed homes — just so you have the full picture?",
          "I get the feeling you've already had a few agents call you and they all said the same thing. Am I wrong?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if I could show you a way to net more after commission, you're probably not open to hearing it right now — right?",
          "You said you want to try it yourself first — what's the plan if you don't get the activity you're hoping for?",
        ]},
        { label: 'Detached Close', items: [
          "I'm not asking you to list with me. I'm asking if it would be a bad idea to have a 20-minute conversation where I show you the numbers and you decide from there.",
          "If the math doesn't work in your favor, I'll tell you. But if it does — wouldn't you want to know?",
        ]},
      ]
    },
    expired: {
      goal: 'Separate yourself from every other agent who called — earn trust through honesty',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "Hey [name], I know your home was recently on the market and didn't sell. I'm not going to do what every other agent does and tell you I have a buyer. I'd rather just be honest.",
          "One question, if that's okay — from your perspective, what do you think actually stopped it from selling?",
        ]},
        { label: 'Detached Questions', items: [
          "What did the agent do — or not do — that frustrated you most?",
          "Are you still motivated to sell, or are you thinking of taking a break?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least hear what I'd do differently — not to convince you to list again, just so you have another perspective?",
          "I get the feeling you've already had three agents call you today. I'm guessing you're not exactly excited to hear another pitch.",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if I showed you exactly what went wrong and how to fix it, you're probably not ready to try again — right?",
          "Most sellers after an expired say the same thing: they wish they'd asked different questions before listing the first time.",
        ]},
        { label: 'Detached Close', items: [
          "I'm not asking you to commit to anything. I'm asking if it's worth 30 minutes to understand why it didn't sell — so whatever you decide next, you're deciding with the full picture.",
        ]},
      ]
    },
    circle: {
      goal: 'Create curiosity without pressure — plant the seed — let them opt in',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "[Address] just sold in your neighborhood — quick question, have you ever thought about what your place might be worth?",
          "I know this is a bit out of the blue. I sold a home nearby and had one honest question — do you have 30 seconds?",
        ]},
        { label: 'Detached Questions', items: [
          "Have you ever thought about selling, or is the plan to stay long-term?",
          "Do you have any idea what homes are actually going for around you right now?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least know what your home is worth today — even if you're not thinking about selling?",
          "I'm not going to assume you're interested in selling. Most people I call aren't. Is there any part of you that's thought about it?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling even if I told you the number was really strong — you'd probably still want to wait. Right?",
          "You said you might list with someone you know — have you actually had that conversation with them yet, or is that still assumed?",
        ]},
        { label: 'Detached Close', items: [
          "I can put together a free market analysis — takes me 10 minutes. If the number doesn't move you, no harm done. If it does, at least you're deciding based on real information.",
        ]},
      ]
    },
    absentee: {
      goal: 'Non-threatening exploration of exit — position as advisor, not salesperson',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "Hey [name], I'm reaching out about the property at [address]. I'm not calling to talk you into selling — I just had one quick question.",
          "Are you still holding that as a rental, or has the situation changed?",
        ]},
        { label: 'Detached Questions', items: [
          "Are you getting the return you expected when you bought it?",
          "What's your long-term plan — hold indefinitely, or is there an exit at some point?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least know what the property's worth today — just so you're making decisions with current information?",
          "I get the feeling you've probably already done the math on it. What did you come up with?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if the equity position is really strong right now, you're probably not looking to do anything with it — right?",
          "Most landlords say they'll sell when the time is right. What does the right time look like for you?",
        ]},
        { label: 'Detached Close', items: [
          "I can run the numbers for you — value, net proceeds, 1031 options. Takes me 20 minutes. If it doesn't change anything for you, that's completely fine.",
        ]},
      ]
    },
    probate: {
      goal: 'Absolute empathy — remove all pressure — be the person who makes this easier',
      sections: [
        { label: 'Empathy First', items: [
          "I know this is a hard time and I really appreciate you taking my call. I promise I'm not going to add to your plate.",
          "I specialize in helping families deal with inherited properties — and my only goal right now is to see if there's anything I can take off your hands.",
        ]},
        { label: 'Detached Questions', items: [
          "Where are you in the process — is the estate still going through probate?",
          "Is the property occupied or vacant, and is anyone in the family managing it?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least get a sense of what the property is worth right now — just so you have that when you're ready?",
          "I'm not going to push you toward any decision. Is there anything I could help simplify right now?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling you're probably not ready to think about any of this right now, and that's completely okay. When does it feel like you might want to revisit it?",
        ]},
        { label: 'Detached Close', items: [
          "I can handle everything — cleanout, minor repairs, paperwork. You'd literally just have to sign. If that's helpful at any point, I'm here.",
          "No rush. I'll follow your lead completely.",
        ]},
      ]
    },
    frbo: {
      goal: 'Build landlord curiosity — create the exit strategy conversation — no pressure',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "I saw your rental listing at [address]. I'm not calling about the rental — I had one quick question about the property itself. Do you have a second?",
          "I work with a lot of landlords in South Bay. Are you planning to hold that one long-term, or have you thought about your options?",
        ]},
        { label: 'Detached Questions', items: [
          "Are you getting the return you expected?",
          "Is the plan to keep renting indefinitely, or is there an end game at some point?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to know what the property is worth today — just so you're making decisions with current numbers?",
          "I get the feeling you've thought about this already. What's kept you from selling?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if I showed you strong equity and a clean net, you'd probably still lean toward holding — right?",
          "Most landlords like the idea of selling until they think about what happens to the cash. Have you looked at a 1031 at all?",
        ]},
        { label: 'Detached Close', items: [
          "I can run the full picture — current value, net proceeds, 1031 options. Takes 20 minutes. No obligation. Just informed decisions.",
        ]},
      ]
    },
    downsizer: {
      goal: 'Validate — remove the fear of the process — let them talk themselves into downsizing',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "I specialize in helping people in South Bay make the transition from a larger home to something more manageable. Is that something that's crossed your mind?",
          "I know you've been in your home a long time. I'm not going to assume you're ready to do anything — I'm just curious if the thought of simplifying has ever come up.",
        ]},
        { label: 'Detached Questions', items: [
          "How long have you been in the home?",
          "Have you thought about what the next chapter looks like — smaller in the same area, or somewhere different?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to at least know what your home is worth today — even if you're not planning to sell anytime soon?",
          "I'm guessing the process feels like a lot. What specifically about it feels the most overwhelming?",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if the numbers made a lot of sense — you'd probably still want to stay put for now. Is that right?",
          "You said you love your home — is it more the home itself, or the idea of going through the whole selling process that makes you hesitate?",
        ]},
        { label: 'Detached Close', items: [
          "Let me show you the numbers — what the home is worth, what you'd net, and what you could move into. If it doesn't make sense, nothing changes.",
          "Downsizers typically do really well in this market — sell high, buy smaller. The math usually works. Let me show it to you.",
        ]},
      ]
    },
    warm_seller: {
      goal: 'Move fast to the appointment — detached but direct — no chasing',
      sections: [
        { label: 'Pattern Interrupt', items: [
          "[Referral name] mentioned you might be thinking about selling — I figured I'd reach out. I'm not going to assume that means you're ready to do anything though. Are you?",
          "I'll skip the pitch. Where are you actually at with this?",
        ]},
        { label: 'Detached Questions', items: [
          "What's your real timeline?",
          "What do you need to walk away with for this to make sense?",
        ]},
        { label: 'No-Oriented Questions', items: [
          "Would it be a bad idea to sit down and at least see what the home is worth right now — before you decide anything?",
          "When you say the commission feels like a lot — is the concern the percentage, or what you'd actually net at closing? Because those are usually different conversations.",
        ]},
        { label: 'Reverse Presumptive', items: [
          "I get the feeling that even if I could show you a really clean path to a sale — you'd probably still want more time to think. Is that fair?",
          "You said you might list with someone you know — have you actually had that conversation with them yet, or is that still assumed?",
        ]},
        { label: 'Detached Close', items: [
          "I can do a full market analysis and walk you through the whole process in one meeting. If it's not the right time after that, no hard feelings.",
          "I don't need you to be ready today. I just want to make sure you have the right information when you are.",
        ]},
      ]
    },
  },

  straightline: {
    zillow: {
      goal: 'Establish authority fast — qualify tight — build certainty — close on the appointment',
      sections: [
        { label: 'Open — Establish Certainty', items: [
          "Thanks for reaching out. I'm Casey Francis with The RISE Group South Bay — one of the top buyer teams in the area. I want to get you the right information fast, so let me ask a few quick questions.",
        ]},
        { label: 'Qualify — LPMAMA', items: [
          "What area are you focused on? (Location)",
          "What's your price range? (Price)",
          "What's driving the move — what made this the right time? (Motivation)",
          "Are you currently working with an agent? (Agent)",
          "Have you been pre-approved? (Mortgage)",
          "Are you available this week to sit down? (Appointment)",
        ]},
        { label: 'Build Certainty — Opportunity', items: [
          "Homes in [area] that match what you're looking for are moving fast right now. If you're serious about [timeline], we need to be proactive.",
          "The buyers who wait on pre-approval are the ones who lose the homes they want. That's just the reality of this market.",
        ]},
        { label: 'Build Certainty — Casey + RISE', items: [
          "I've helped buyers all across South Bay — I know exactly what it takes to get your offer accepted in a competitive market.",
          "The RISE Group South Bay is one of the top-performing teams in the area. You'd have the resources, relationships, and technology of a top team behind you.",
        ]},
        { label: 'Close — Assumptive', items: [
          "Based on everything you've told me, all we need to do now is set up a buyer consult so I can show you exactly what's available and what your path looks like. Are you available Tuesday or Wednesday?",
          "The next step is simple — we sit down for an hour, I show you everything, and we figure out if now is the right time. Does that work?",
        ]},
      ]
    },
    fthb: {
      goal: 'Build confidence fast — simplify the path — close on the consult and pre-approval',
      sections: [
        { label: 'Open', items: [
          "So you're looking at buying your first home — that's a big deal and I want to help you do it right. I've helped a lot of first-time buyers in South Bay get into homes they didn't think they could afford.",
        ]},
        { label: 'Qualify', items: [
          "Have you talked to a lender yet about what you qualify for?",
          "What area or neighborhood are you picturing?",
          "What's your timeline — when would you like to be in a home?",
        ]},
        { label: 'Build Certainty', items: [
          "Here's what most first-time buyers don't know — most of them qualify for more than they think. The lender conversation usually surprises people.",
          "I've walked dozens of first-time buyers through this exact process. It's simpler than it looks, and I'll be there every step of the way.",
        ]},
        { label: 'Close', items: [
          "All we need to do now is get you connected with the right lender and sit down to map out your plan. That's it. Are you available this week?",
          "The first-time buyer process has exactly three steps — lender, search, offer. I'll handle all of it. Let's set up a time.",
        ]},
      ]
    },
    open_house: {
      goal: 'Qualify fast — establish authority — close on the next step',
      sections: [
        { label: 'Open', items: [
          "Welcome! I'm Casey — I want to make sure you get the most out of today. Quick question — are you actively searching right now, or more in explore mode?",
        ]},
        { label: 'Qualify', items: [
          "Are you working with another agent?",
          "Do you have a home to sell before you buy?",
          "What's your timeline?",
          "Have you been pre-approved?",
        ]},
        { label: 'Build Certainty', items: [
          "Homes in this area are moving quickly. Buyers with financing in place and an agent are the ones winning right now.",
          "I know this neighborhood extremely well — I can show you everything available right now that matches what you're looking for.",
        ]},
        { label: 'Close', items: [
          "Based on what you've told me, I think there are homes you'd really want to see. All we need to do is set up a time this week — I'll pull the right listings and we'll take a look. Does Tuesday or Wednesday work?",
        ]},
      ]
    },
    warm_buyer: {
      goal: 'Capitalize on trust — move fast — close on the meeting',
      sections: [
        { label: 'Open', items: [
          "[Referral name] spoke very highly of you — I'm Casey Francis with The RISE Group South Bay. I'd love to help you the same way I helped them. Let me get a quick picture of where you're at.",
        ]},
        { label: 'Qualify', items: [
          "What's your timeline?",
          "What area are you looking in?",
          "Have you been pre-approved?",
          "What does the ideal home look like for you?",
        ]},
        { label: 'Build Certainty', items: [
          "With the referral from [name] and what you've told me — I already have a clear picture of what we need to do.",
          "The market moves fast. The buyers who win are the ones who are prepared and have the right team behind them.",
        ]},
        { label: 'Close', items: [
          "All we need to do now is set up a buyer consult — one hour, I walk you through everything, and we hit the ground running. Are you available this week?",
        ]},
      ]
    },
    fsbo: {
      goal: 'Establish authority — reframe the FSBO math — close on the appointment',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group South Bay. I saw your home is for sale — I'll be upfront, I'm a Realtor. Before you hang up, I was hoping to share one number with you that most FSBOs don't know.",
          "Only 2% of FSBOs sell to a non-agent buyer. 98% end up listing anyway — usually for less than market value. I can show you the exact math for your area.",
        ]},
        { label: 'Qualify', items: [
          "How long have you been on the market?",
          "What's your timeline for selling?",
          "Are you getting serious offers, or mostly inquiries?",
        ]},
        { label: 'Build Certainty', items: [
          "Priced correctly, marketed aggressively, and negotiated sharply — you will net more listed with us than FSBO. That's not a pitch, that's math.",
          "I've helped sellers in your area achieve above-ask prices by creating a competitive bidding environment. You can't do that without market exposure.",
        ]},
        { label: 'Close', items: [
          "All we need to do is sit down for 30 minutes. I'll show you exactly what I'd do differently, what we'd price it at, and what you'd net. If the numbers don't work in your favor, I'll tell you. Are you available this week?",
        ]},
      ]
    },
    expired: {
      goal: 'Establish credibility — show exactly what went wrong — close on the relisting',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group South Bay. Your home was recently on the market and it didn't sell — I think I know why, and I can fix it. Would you give me five minutes?",
          "I looked at your previous listing. There were three things that cost you the sale — pricing strategy, market exposure, and negotiation. I can walk you through all three.",
        ]},
        { label: 'Diagnose', items: [
          "What did your agent tell you when it expired?",
          "Were you getting showings but no offers, or no showings at all?",
          "Are you still motivated to sell?",
        ]},
        { label: 'Build Certainty', items: [
          "Homes in your area are selling — but they sell when priced correctly, marketed to the right buyers, and represented by an agent who negotiates hard.",
          "The RISE Group has sold homes in this area. I know exactly what buyers here respond to.",
        ]},
        { label: 'Close', items: [
          "All we need to do now is sit down so I can show you the new strategy — pricing, marketing plan, and timeline. If I can't make you confident in the plan, you don't list. Are you available this week or next?",
        ]},
      ]
    },
    circle: {
      goal: 'Pattern interrupt — create urgency with market data — close on the valuation meeting',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group. [Address] just sold in your neighborhood for [price]. Quick question — have you thought about what your home might be worth today?",
          "When homes sell at strong prices in a neighborhood, there's a window — and smart homeowners take advantage of it.",
        ]},
        { label: 'Qualify', items: [
          "Have you thought about selling, or are you planning to stay long-term?",
          "How long have you been in the home?",
          "Do you know what homes in the area are actually selling for right now?",
        ]},
        { label: 'Build Certainty', items: [
          "Right now is one of the best windows for sellers in South Bay — low inventory, strong demand. Sellers who move now are getting top dollar.",
          "The equity you've built in this home is real money. Knowing what it's worth costs you nothing.",
        ]},
        { label: 'Close', items: [
          "All we need to do is a quick 30-minute market analysis — I'll show you exactly what your home is worth and what a sale would look like. No obligation. Are you available this week?",
        ]},
      ]
    },
    absentee: {
      goal: 'Make the equity case — reframe holding vs. selling — close on the valuation call',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group South Bay. I'm reaching out about your property at [address]. Quick question — are you maximizing the return on that asset right now?",
          "Most investors I work with in this area are sitting on more equity than they realize — and there are smarter places for that money to work.",
        ]},
        { label: 'Qualify', items: [
          "How long have you owned it?",
          "What's the current return looking like?",
          "Have you thought about your exit strategy?",
        ]},
        { label: 'Build Certainty', items: [
          "Property values in this area have shifted significantly. The equity you're sitting on could be working a lot harder for you elsewhere.",
          "With a 1031 exchange, you can sell, defer capital gains, and roll into a higher-performing asset. I've done this with several investors in the area.",
        ]},
        { label: 'Close', items: [
          "All we need to do is run the numbers — current value, net proceeds, 1031 options. Takes 20 minutes. If the math doesn't work, I'll tell you straight. Can we connect this week?",
        ]},
      ]
    },
    probate: {
      goal: 'Position as the solution — build certainty in simplifying everything — close on the appointment',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group. I specialize in inherited properties and probate sales — I know how overwhelming this process can be, and my job is to make it as simple as possible for your family.",
          "I've helped many families navigate this — and I can handle everything from cleanout to close. You focus on the family. I'll handle the property.",
        ]},
        { label: 'Understand the Situation', items: [
          "Where are you in the probate process?",
          "Is the property occupied or vacant?",
          "Are there other family members who need to be part of the decision?",
        ]},
        { label: 'Build Certainty', items: [
          "I've sold inherited properties in all conditions — as-is, tenanted, in need of work. I have the relationships to handle all of it.",
          "The RISE Group will market the property aggressively and get you the best possible price. You won't leave money on the table.",
        ]},
        { label: 'Close', items: [
          "All we need to do is sit down for 30 minutes — I'll walk you through the entire process, what the property is worth, and your options. Your family makes the decision — I just want to make sure you have everything you need to make it. Are you available this week?",
        ]},
      ]
    },
    frbo: {
      goal: 'Make the selling case — show the equity opportunity — close on the valuation meeting',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group. I saw your rental listing at [address] — quick question, are you maximizing the return on that property right now?",
          "I work with a lot of landlords in South Bay, and most are surprised by what their property is worth today versus what they paid.",
        ]},
        { label: 'Qualify', items: [
          "How long have you owned it?",
          "What's the current cash flow looking like?",
          "Have you thought about your exit strategy?",
        ]},
        { label: 'Build Certainty', items: [
          "Rental income is flat in a lot of areas, but appreciation has been strong. The equity you're sitting on could be working harder.",
          "With a 1031 exchange, you can sell, defer capital gains, and reinvest into a higher-performing asset. That's how smart investors grow.",
        ]},
        { label: 'Close', items: [
          "All I'm asking for is 20 minutes — I'll run the full picture for you. Current value, net proceeds, 1031 options. If it doesn't make sense to sell, I'll tell you. Can we connect this week?",
        ]},
      ]
    },
    downsizer: {
      goal: 'Make the financial case for downsizing — create urgency — close on the listing consult',
      sections: [
        { label: 'Open', items: [
          "Hey [name], Casey Francis with The RISE Group South Bay. I specialize in helping people make the transition to a smaller home — and I want to show you something most people in your position don't realize.",
          "Downsizers are actually in the best position in this market — you sell at a peak and buy smaller at a lower price. The equity gap works in your favor.",
        ]},
        { label: 'Qualify', items: [
          "How long have you been in the home?",
          "Have you thought about what the next chapter looks like?",
          "Have you seen what homes are selling for in your area right now?",
        ]},
        { label: 'Build Certainty', items: [
          "Your home has appreciated significantly. You're sitting on real equity — and that equity can fund a very comfortable next chapter.",
          "The RISE Group has helped many homeowners in South Bay make exactly this transition — selling at peak value and moving into something perfect for this stage of life.",
        ]},
        { label: 'Close', items: [
          "All we need to do is sit down for 30 minutes. I'll show you what your home is worth, what you'd net, and what you could move into. If it doesn't make sense, nothing changes. Are you available this week or next?",
        ]},
      ]
    },
    warm_seller: {
      goal: 'Move fast — establish confidence — close on the listing appointment immediately',
      sections: [
        { label: 'Open', items: [
          "[Referral name] said great things about you — I'm Casey Francis with The RISE Group South Bay. Let's get right to it — I know you're thinking about selling, and I want to show you exactly how I'd approach it.",
        ]},
        { label: 'Qualify', items: [
          "What's your timeline for wanting to be on the market?",
          "What do you need to net from the sale?",
          "Where are you planning to go when you sell?",
        ]},
        { label: 'Build Certainty', items: [
          "I know exactly how to price your home to create competition and get you top dollar.",
          "The RISE Group is one of the top teams in the area — we have the marketing, technology, and network to get maximum exposure from day one.",
        ]},
        { label: 'Close', items: [
          "All we need to do now is set up a listing consultation — I'll come by, walk through the home, run the numbers, and show you the full marketing plan. Are you available this week?",
        ]},
      ]
    },
  },
};

export const BUYER_SCRIPT_KEYS = ['zillow', 'fthb', 'open_house', 'warm_buyer', 'buyer'];
export const SELLER_SCRIPT_KEYS = ['fsbo', 'expired', 'circle', 'absentee', 'probate', 'frbo', 'downsizer', 'warm_seller'];

export const BUYER_CLARIFYING = [
  "Hold on — when you said [blank], what did you mean by that exactly?",
  "[Name], can you unwrap that for me? When you said [blank] — what did you mean by that?",
  "Just so I understand — when you say you're not ready, what does ready actually look like for you?",
  "When you say the payment feels too high — is that based on a number you ran, or more of a gut feeling?",
  "You mentioned you've been looking for a while — what's been the main thing that hasn't felt right so far?",
  "When you say you want to wait and see — what specifically are you waiting on? What would have to happen?",
  "You said you're just browsing — out of curiosity, what would make this go from browsing to real for you?",
  "When you say you're not sure about the area — is it something specific about the neighborhood, or more about not knowing it well enough yet?",
  "You mentioned you talked to a lender — what did they tell you, and how did that land for you?",
  "When you say you need to think about it — what part of it is the sticking point? Is it the process, the timing, or something else?",
];

export const SELLER_CLARIFYING = [
  "Hold on — when you said [blank], what did you mean by that?",
  "[Name], help me understand something — when you said [blank], can you go over what you meant by that?",
  "When you say you want to wait for the right time — what does the right time look like to you? What would have to be true?",
  "You said you're not sure about the price — is that about what you think the home is worth, or what you need to walk away with?",
  "When you say the commission feels like a lot — is the concern the percentage itself, or what you'd actually net at closing?",
  "You mentioned you had a bad experience before — what specifically happened? I want to make sure we don't go there again.",
  "When you say you want to try it yourself first — what's the plan if you don't get the activity you're hoping for?",
  "You said you might list with someone you know — have you actually had that conversation with them yet, or is that still assumed?",
  "When you say the market isn't right — what are you seeing or hearing that's giving you that feeling?",
  "You mentioned you need a specific number — is that based on what you owe, what you want to walk away with, or what you think the home is worth? Because those are often three different numbers.",
];

export const LEAD_CONTEXT = {
  zillow: 'Zillow inbound buyer — clicked a listing. Qualify with LPMAMA. Goal: book buyer consult.',
  fthb: 'First-time home buyer — nervous, overwhelmed. Build trust. Uncover pre-approval and timeline. Goal: buyer consult.',
  open_house: 'Open house lead — may be casually browsing. Determine if they have an agent. Goal: qualify and set next step.',
  warm_buyer: 'Warm referral buyer — higher trust. Confirm needs quickly. Goal: book meeting fast.',
  fsbo: 'FSBO — guarded, resistant to agents. Use Reverse Selling detached posture. Goal: disarm, set listing appointment.',
  expired: 'Expired listing — frustrated their home did not sell. Use empathy and Socratic questions. Goal: differentiate, set appointment.',
  circle: 'Circle prospecting cold call — neighbor of a recent sale. Goal: pattern interrupt, build curiosity, pivot to seller conversation.',
  absentee: 'Absentee owner / landlord. Goal: explore if they have considered selling and uncover timeline.',
  probate: 'Probate or inherited property — emotionally sensitive. Lead with empathy. Goal: simplify the process, set appointment.',
  frbo: 'For Rent By Owner — landlord. Goal: explore if they have considered selling or investor conversation.',
  downsizer: 'Downsizer — often 55+, looking smaller. Goal: uncover timeline, equity position, book consult.',
  warm_seller: 'Warm referral seller — higher trust. Move to pricing and timeline. Goal: set listing appointment.',
  '': 'General real estate call — adapt to transcript context.'
};

export const FILLERS = {
  objection: [
    "I hear you, I totally get that...",
    "That's a fair point, and I appreciate you being upfront...",
    "You know what, a lot of people feel that way at first...",
    "That makes sense, and honestly it's a good thing you brought that up..."
  ],
  question: [
    "That makes sense, thanks for sharing that. Just so I have a better understanding...",
    "I appreciate you telling me that. Help me understand this a little better...",
    "Got it. And I'm just curious about something...",
    "OK so let me ask you this...",
    "Right, right. And out of curiosity..."
  ],
  threea: [
    "I appreciate you sharing that, I want to make sure I understand where you're coming from...",
    "That is completely fair, and honestly most people I talk to feel the same way...",
    "I hear you, and I'm glad you said that because it's important...",
    "No that makes sense, let me just make sure I'm on the same page..."
  ],
  motivation: [
    "Got it, let's dig into what's really driving this for you...",
    "That's helpful, let me understand what's behind that a bit more...",
    "Makes sense, I'm just curious what's really pushing this for you right now...",
    "OK, so let me ask you something a little deeper..."
  ],
  close: [
    "You know what, based on everything you've told me...",
    "I'll be honest with you, I think there's a real opportunity here...",
    "Here's what I'm thinking, and tell me if this makes sense...",
    "So let me ask you something, and be straight with me..."
  ]
};

export function buildSystemPrompt(aiEngine) {
  if (aiEngine !== 'claude') return buildSystemPromptShort();
  return 'You are an elite real estate sales coach embedded in a live call tool for Casey Francis, agent with The RISE Group South Bay in Los Angeles. You have fully internalized four sales methodologies and a comprehensive real estate objection library. Blend them naturally.\n\n' +
  'NEPQ: 5-stage sequence Connection > Situation > Problem Awareness > Consequence > Solution Awareness. Use ellipses to slow the conversation. One question at a time. Make the lead articulate their own pain. ABC questions: "Is that because X, Y, or something else?" Emotional: "How does that make you feel?" Status Quo: "Is it an option to just stay put?"\n\n' +
  'Reverse Selling: Detached authority. Agent does not need the business. Pattern interrupt: "I\'ll be upfront - I\'m a Realtor, and before you hang up, I was hoping to ask you something quick, would that be ok?" Reverse Presumptive: "I get the feeling that even if I could get you a better result, there\'s probably no way you\'d meet with me, right?" No-oriented: "Would it be a bad idea to..." Because: "Because let\'s face it, you\'re not going to do anything unless it makes sense, right?" ARP: Acknowledge > Reframe > Permission question.\n\n' +
  'Mike Ferry MFO: Direct, assumptive, always pivots to close. "All we need to do now is simply sign the contract so I can help you get what you want in the time you want — won\'t that be great?"\n' +
  'Objection handlers: "We want to think it over" > "Three minds are better than two, let\'s think out loud together." "Sleep on it" > "Sign tonight contingent on your approval within 24 hours." "Save commission" > "Only 2% of FSBOs sell themselves, 98% are listed by agents." "Another agent said more money" > "They plan to beat you up on price week after week." "Friend in the business" > "Do you absolutely have to sell or are you just doing your friend a favor?" "List high" > "Would you rather have a bidding war or not have a chance to negotiate any offer?"\n\n' +
  'Straight Line Belfort: Build certainty on 3 levels — the opportunity, the agent Casey, the company RISE Group South Bay. Loop objections: acknowledge > reframe > close again.\n\n' +
  'OBJECTION LIBRARY:\n' +
  'RATES/TIMING: "Waiting for rates to drop" > "When every waiting buyer floods back in at the same time, what happens to prices?" "Market going to crash" > "If you\'re wrong and prices go up 8% this year, what does that do to your plan?"\n' +
  'COMMISSION: "Save commission/FSBO" > "Only 2% of FSBOs sell to a non-agent buyer. 98% list with an agent anyway. Does the math work?" "Negotiate commission" > "Agents who discount their commission usually can\'t negotiate full price for your home either."\n' +
  'SELLER: "Interview other agents" > "What are you evaluating when you talk to them?" "We want to list higher" > "Every week it sits overpriced, buyers assume something is wrong with it."\n' +
  'BUYER: "Need to sell first" > "If we could get you into contract on your sale in 30-45 days, would you want to start looking now?" "Just browsing" > "If the perfect home showed up tomorrow at the right price, would you be in a position to move on it?"\n' +
  'GENERAL: "Call me back in 6 months" > "What\'s going to be different in 6 months?" "Not interested" > "Is that because now isn\'t the right time, or because you haven\'t seen the right reason yet?"\n\n' +
  'YOUR ROLE: Analyze the transcript and lead type. Generate responses that are immediately speakable. Natural, confident, advisor tone. No dashes in output. Every option must sound like something a sharp experienced agent would actually say out loud. The agent is Casey Francis with RISE Real Estate / The RISE Group South Bay in Los Angeles.';
}

function buildSystemPromptShort() {
  return 'You are a live real estate sales coach for Casey Francis, The RISE Group South Bay LA. ' +
  'You know NEPQ, Reverse Selling (Mulrenin), Mike Ferry scripts, and Straight Line (Belfort). ' +
  'NEPQ stages: Connection > Situation > Problem Awareness > Consequence > Solution Awareness. Use ellipses for pauses. One question at a time. ' +
  'Reverse Selling: detached posture, no-oriented questions, reverse presumptive, ARP objection method. ' +
  'MFO: "three minds better than two"; "only 2% of FSBOs sell themselves"; "would you rather have a bidding war or no offers"; "do you absolutely have to sell or just doing your friend a favor". ' +
  'Close language: "all we need to do now is simply sign the contract so I can help you get what you want in the time you want, won\'t that be great." ' +
  'Belfort: build certainty on 3 levels - opportunity, agent Casey, company RISE Group. Loop objections. ' +
  'Hormozi 3A: Acknowledge (validate warmly), Associate (relatable story - "I had a client who felt the same way..."), Ask (one NEPQ question that makes them sell themselves). ' +
  'Output 3 short speakable options. Natural advisor tone. No dashes. Each under 3 sentences. Casey is the agent, RISE Real Estate South Bay is the brokerage.';
}

export function buildCoachPrompt(mode, lastLines, leadCtx, style, clarifyingList) {
  const base = `Lead: ${leadCtx}. Recent transcript: ${lastLines}.`;
  const fmt  = 'Format:\n';

  if (style === 'nepq') {
    switch (mode) {
      case 'threea':
        return `${base} NEPQ 3A REFRAME — Acknowledge their concern with empathy (no judgment), Associate with a story of a client who felt the same way, Ask one NEPQ consequence or problem-awareness question that makes them sell themselves. Slow, deliberate tone. Use ellipses. One idea at a time.\n${fmt}REFRAME CONTEXT: [one line]\nOPTION 1 [Acknowledge]\n[say this]\nOPTION 2 [Associate]\n[say this]\nOPTION 3 [Ask — NEPQ]\n[the question]\nCOACH NOTE: [deliver in sequence with pauses]`;
      case 'objection':
        return `${base} NEPQ OBJECTION HANDLE — All 3 options use NEPQ. Make the lead uncover their own pain. Use ellipses for pauses. One question at a time. Slow and curious tone — never pushy.\n${fmt}OBJECTION DETECTED: [one line]\nOPTION 1 [Problem Awareness]\n[say this]\nOPTION 2 [Consequence Question]\n[say this]\nOPTION 3 [Status Quo Question]\n[say this]\nCOACH NOTE: [one line]`;
      case 'question': {
        const clarifyBlock = clarifyingList && clarifyingList.length
          ? `\n\nCLARIFYING QUESTION BANK (pick the most contextually relevant ones and adapt them naturally to the conversation):\n${clarifyingList.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
          : '';
        return `${base} NEPQ CLARIFYING QUESTION — Select 3 questions from the bank below that best fit what was just said. Adapt the wording naturally. Use ellipses. Slow, curious, non-threatening tone. Never two questions at once.${clarifyBlock}\n\n${fmt}CALL STAGE: [stage]\nOPTION 1 [Clarifying]\n[ask this]\nOPTION 2 [Clarifying]\n[ask this]\nOPTION 3 [Clarifying]\n[ask this]\nCOACH NOTE: [one line]`;
      }
      case 'close':
        return `${base} NEPQ CLOSE — 3 closes that use consequence and solution-awareness language. Lead the prospect to close themselves. No pressure. Curious tone. Use ellipses.\n${fmt}CLOSE STRATEGY: [one line]\nOPTION 1 [Solution Awareness]\n[say this]\nOPTION 2 [Consequence Close]\n[say this]\nOPTION 3 [Permission Question]\n[say this]\nCOACH NOTE: [one line]`;
      case 'motivation':
        return `${base} NEPQ MOTIVATION DIG — 3 Situation/Problem Awareness questions that uncover the lead's real underlying reason for moving and what's driving the timing. Make them articulate their own "why" and what happens if nothing changes. Use ellipses. Slow, curious, non-threatening tone. One question at a time.\n${fmt}MOTIVATION FOCUS: [one line, what's still unclear]\nOPTION 1 [Situation Question]\n[ask this]\nOPTION 2 [Problem Awareness Question]\n[ask this]\nOPTION 3 [Consequence Question]\n[ask this]\nCOACH NOTE: [one line]`;
      default: return '';
    }
  }

  if (style === 'reverse') {
    switch (mode) {
      case 'threea':
        return `${base} REVERSE SELLING 3A — Use detached posture. Acknowledge with calm indifference, not desperation. Associate with a reframe that lowers resistance. Ask a no-oriented or reverse presumptive question.\n${fmt}REFRAME CONTEXT: [one line]\nOPTION 1 [Acknowledge — Detached]\n[say this]\nOPTION 2 [Associate — Reframe]\n[say this]\nOPTION 3 [Ask — No-Oriented]\n[the question]\nCOACH NOTE: [ARP in sequence]`;
      case 'objection':
        return `${base} REVERSE SELLING OBJECTION — All 3 use Reverse Selling. Detached authority. No-oriented questions. ARP method (Acknowledge, Reframe, Permission question). Agent does not need the business.\n${fmt}OBJECTION DETECTED: [one line]\nOPTION 1 [No-Oriented]\n[say this]\nOPTION 2 [Reverse Presumptive]\n[say this]\nOPTION 3 [ARP]\n[say this]\nCOACH NOTE: [one line]`;
      case 'question':
        return `${base} REVERSE SELLING QUESTION — 3 questions using detached posture. Use pattern interrupts, no-oriented phrasing ("Would it be a bad idea to..."), or reverse presumptive ("I get the feeling even if X, you probably wouldn't..."). Calm, unattached.\n${fmt}CALL STAGE: [stage]\nOPTION 1 [Pattern Interrupt]\n[ask this]\nOPTION 2 [No-Oriented]\n[ask this]\nOPTION 3 [Reverse Presumptive]\n[ask this]\nCOACH NOTE: [one line]`;
      case 'close':
        return `${base} REVERSE SELLING CLOSE — 3 closes using detached posture. Assume they won't move forward. Make them argue for it. Use "I don't want to assume..." or "I get the feeling this probably isn't the right time..."\n${fmt}CLOSE STRATEGY: [one line]\nOPTION 1 [Detached Assumptive]\n[say this]\nOPTION 2 [Reverse Presumptive Close]\n[say this]\nOPTION 3 [Permission Close]\n[say this]\nCOACH NOTE: [one line]`;
      case 'motivation':
        return `${base} REVERSE SELLING MOTIVATION DIG — 3 questions using detached posture that get the lead to reveal their real motivation without the agent seeming needy. Use no-oriented framing ("Would it be fair to say...") or reverse presumptive ("I get the feeling the real reason is..."). Calm, unattached.\n${fmt}MOTIVATION FOCUS: [one line]\nOPTION 1 [No-Oriented]\n[ask this]\nOPTION 2 [Reverse Presumptive]\n[ask this]\nOPTION 3 [Detached Curiosity]\n[ask this]\nCOACH NOTE: [one line]`;
      default: return '';
    }
  }

  if (style === 'straightline') {
    switch (mode) {
      case 'threea':
        return `${base} STRAIGHT LINE 3A — Build certainty. Acknowledge the concern, then immediately loop back toward the close. Associate with a success story that builds certainty in the opportunity. Ask an assumptive close question.\n${fmt}REFRAME CONTEXT: [one line]\nOPTION 1 [Acknowledge + Loop]\n[say this]\nOPTION 2 [Certainty Story]\n[say this]\nOPTION 3 [Assumptive Close Question]\n[the question]\nCOACH NOTE: [build certainty on all 3 levels]`;
      case 'objection':
        return `${base} STRAIGHT LINE OBJECTION — All 3 loop back to the close. Build certainty on the opportunity, Casey, and RISE Group. Acknowledge briefly, reframe fast, close again. Confident, direct.\n${fmt}OBJECTION DETECTED: [one line]\nOPTION 1 [Loop — Opportunity]\n[say this]\nOPTION 2 [Loop — Agent]\n[say this]\nOPTION 3 [Loop — Close]\n[say this]\nCOACH NOTE: [one line]`;
      case 'question':
        return `${base} STRAIGHT LINE QUESTION — 3 questions that move the prospect toward certainty and toward the close. Direct and assumptive. Build urgency and logical motivation.\n${fmt}CALL STAGE: [stage]\nOPTION 1 [Logical Urgency]\n[ask this]\nOPTION 2 [Certainty Building]\n[ask this]\nOPTION 3 [Assumptive Pivot]\n[ask this]\nCOACH NOTE: [one line]`;
      case 'close':
        return `${base} STRAIGHT LINE CLOSE — 3 direct, assumptive closes. "All we need to do now is simply..." language. Build certainty and urgency. Loop if they push back.\n${fmt}CLOSE STRATEGY: [one line]\nOPTION 1 [Direct Assumptive]\n[say this]\nOPTION 2 [Urgency Close]\n[say this]\nOPTION 3 [Loop Close]\n[say this]\nCOACH NOTE: [one line]`;
      case 'motivation':
        return `${base} STRAIGHT LINE MOTIVATION DIG — 3 direct questions that expose the lead's real motivation and build urgency around it, moving toward the close. Confident, assumptive tone.\n${fmt}MOTIVATION FOCUS: [one line]\nOPTION 1 [Direct Why]\n[ask this]\nOPTION 2 [Urgency Angle]\n[ask this]\nOPTION 3 [Certainty Building]\n[ask this]\nCOACH NOTE: [one line]`;
      default: return '';
    }
  }

  if (style === 'condensed') {
    const cue = 'Each OPTION is a short 3-8 word ad-lib cue or angle, NOT a full sentence — a phrase Casey can build on in his own words, not something to read verbatim.';
    switch (mode) {
      case 'threea':
        return `${base} CONDENSED 3A — ${cue}\n${fmt}REFRAME CONTEXT: [one line]\nOPTION 1 [Acknowledge]\n[short cue]\nOPTION 2 [Associate]\n[short cue]\nOPTION 3 [Ask]\n[short cue]\nCOACH NOTE: [one line]`;
      case 'objection':
        return `${base} CONDENSED OBJECTION HANDLE — 3 short cues, different angles. ${cue}\n${fmt}OBJECTION DETECTED: [one line]\nOPTION 1 [NEPQ angle]\n[short cue]\nOPTION 2 [Reverse Selling angle]\n[short cue]\nOPTION 3 [Mike Ferry angle]\n[short cue]\nCOACH NOTE: [one line]`;
      case 'question':
        return `${base} CONDENSED QUESTION — 3 short cues pointing at what to ask, not the exact wording. ${cue}\n${fmt}CALL STAGE: [stage]\nOPTION 1 [Consequence angle]\n[short cue]\nOPTION 2 [Reverse Presumptive angle]\n[short cue]\nOPTION 3 [Socratic angle]\n[short cue]\nCOACH NOTE: [one line]`;
      case 'close':
        return `${base} CONDENSED CLOSE — 3 short cues for closes. ${cue}\n${fmt}CLOSE STRATEGY: [one line]\nOPTION 1 [Soft Assumptive angle]\n[short cue]\nOPTION 2 [Direct Assumptive angle]\n[short cue]\nOPTION 3 [Curiosity angle]\n[short cue]\nCOACH NOTE: [one line]`;
      case 'motivation':
        return `${base} CONDENSED MOTIVATION DIG — 3 short cues pointing at what to dig into. ${cue}\n${fmt}MOTIVATION FOCUS: [one line]\nOPTION 1 [Situation angle]\n[short cue]\nOPTION 2 [Reverse Presumptive angle]\n[short cue]\nOPTION 3 [Consequence angle]\n[short cue]\nCOACH NOTE: [one line]`;
      default: return '';
    }
  }

  // No style selected — default (mixed frameworks)
  switch (mode) {
    case 'threea':
      return `${base} Apply Hormozi 3A framework: Acknowledge (validate their concern warmly, 1-2 sentences), Associate (brief relatable story or analogy, 1-2 sentences), Ask (one NEPQ question that makes them think and sell themselves). Format exactly:\nREFRAME CONTEXT: [one line describing their concern]\nOPTION 1 [Acknowledge]\n[say this]\nOPTION 2 [Associate]\n[say this]\nOPTION 3 [Ask]\n[the question]\nCOACH NOTE: [deliver all 3 in sequence with pauses]`;
    case 'objection':
      return `${base} OBJECTION HANDLE - 3 options, different frameworks.\n${fmt}OBJECTION DETECTED: [one line]\nOPTION 1 [NEPQ]\n[say this]\nOPTION 2 [Reverse Selling]\n[say this]\nOPTION 3 [Mike Ferry]\n[say this]\nCOACH NOTE: [one line]`;
    case 'question':
      return `${base} ASK QUESTION - 3 NEPQ questions to deepen engagement.\n${fmt}CALL STAGE: [stage]\nOPTION 1 [Consequence Question]\n[ask this]\nOPTION 2 [Reverse Presumptive]\n[ask this]\nOPTION 3 [Socratic]\n[ask this]\nCOACH NOTE: [one line]`;
    case 'close':
      return `${base} CLOSE - 3 appointment close attempts.\n${fmt}CLOSE STRATEGY: [one line]\nOPTION 1 [Soft Assumptive]\n[say this]\nOPTION 2 [Direct Assumptive]\n[say this]\nOPTION 3 [Curiosity Close]\n[say this]\nCOACH NOTE: [one line]`;
    case 'motivation':
      return `${base} MOTIVATION DIG - 3 questions, different frameworks, that uncover the lead's real underlying motivation and what's driving the timing.\n${fmt}MOTIVATION FOCUS: [one line]\nOPTION 1 [NEPQ Situation]\n[ask this]\nOPTION 2 [Reverse Presumptive]\n[ask this]\nOPTION 3 [Consequence Question]\n[ask this]\nCOACH NOTE: [one line]`;
    default:
      return '';
  }
}

// Short style guidance appended to the single-call auto-coach prompt (which classifies
// AND responds in one shot, so it can't call buildCoachPrompt per-mode ahead of time).
export function buildAutoStyleHint(style) {
  if (style === 'condensed') return 'Keep each OPTION a short 3-8 word ad-lib cue or angle, not a full sentence to read verbatim.';
  if (style === 'nepq')        return 'Phrase every OPTION using NEPQ: slow, curious, one question at a time, use ellipses for pauses.';
  if (style === 'reverse')     return 'Phrase every OPTION using Reverse Selling: detached posture, no-oriented or reverse-presumptive framing.';
  if (style === 'straightline') return 'Phrase every OPTION using Straight Line: confident, assumptive, always looping back toward the close.';
  return '';
}

import { IconShieldAlert, IconLightbulb, IconTarget, IconCalendar } from './icons.jsx';

// threea (3A Reframe) intentionally keeps a text monogram badge instead of an
// icon component — see CoachCard/AssistView render sites, which special-case
// a null icon into a "3A" text glyph.
export const COACHING_CONFIG = {
  objection:  { label: 'Objection',  icon: IconShieldAlert, color: 'var(--red)',    colorDim: 'var(--red-dim)'    },
  question:   { label: 'Question',   icon: IconLightbulb,   color: 'var(--blue)',   colorDim: 'var(--blue-dim)'   },
  motivation: { label: 'Motivation', icon: IconTarget,      color: 'var(--teal)',   colorDim: 'var(--teal-dim)'   },
  close:      { label: 'Close',      icon: IconCalendar,    color: 'var(--green)',  colorDim: 'var(--green-dim)'  },
  threea:     { label: '3A Reframe', icon: null,            color: 'var(--purple)', colorDim: 'var(--purple-dim)' },
};

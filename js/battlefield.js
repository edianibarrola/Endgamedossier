(() => {
  const events = [
  {
    "title": "PORTALS OPEN",
    "kind": "CONVERGENCE",
    "desc": "Strange and the Masters of the Mystic Arts open portals, bringing restored allies and armies onto the ruined compound battlefield.",
    "people": [
      {
        "name": "Doctor Strange",
        "target": "dossier-018"
      },
      {
        "name": "Wong",
        "target": "dossier-019"
      },
      {
        "name": "T'Challa",
        "target": "dossier-020"
      },
      {
        "name": "Peter Parker",
        "target": "dossier-017"
      },
      {
        "name": "Valkyrie",
        "target": "dossier-035"
      }
    ]
  },
  {
    "title": "ASSEMBLE",
    "kind": "MOBILIZATION",
    "desc": "Steve finally calls the assembled force forward against 2014 Thanos and his army.",
    "people": [
      {
        "name": "Steve Rogers",
        "target": "dossier-002"
      },
      {
        "name": "Thor",
        "target": "dossier-004"
      },
      {
        "name": "Tony Stark",
        "target": "dossier-001"
      }
    ]
  },
  {
    "title": "THANOS ENGAGED",
    "kind": "PRIMARY THREAT",
    "desc": "The heroes converge on 2014 Thanos while the Infinity Stones become the battle's critical objective.",
    "people": [
      {
        "name": "Thanos (2014 variant)",
        "target": "dossier-014"
      },
      {
        "name": "Steve Rogers",
        "target": "dossier-002"
      },
      {
        "name": "Thor",
        "target": "dossier-004"
      },
      {
        "name": "Tony Stark",
        "target": "dossier-001"
      }
    ]
  },
  {
    "title": "GAUNTLET RELAY",
    "kind": "STONE TRANSIT",
    "desc": "Clint emerges with the Nano Gauntlet; it passes through the battlefield toward Scott's quantum tunnel van.",
    "people": [
      {
        "name": "Clint Barton",
        "target": "dossier-006"
      },
      {
        "name": "T'Challa",
        "target": "dossier-020"
      },
      {
        "name": "Peter Parker",
        "target": "dossier-017"
      }
    ]
  },
  {
    "title": "CAPTAIN MARVEL",
    "kind": "ORBITAL ENTRY",
    "desc": "Carol destroys Sanctuary II and joins the fight around the Nano Gauntlet.",
    "people": [
      {
        "name": "Carol Danvers",
        "target": "dossier-009"
      },
      {
        "name": "Peter Parker",
        "target": "dossier-017"
      },
      {
        "name": "Thanos (2014 variant)",
        "target": "dossier-014"
      }
    ]
  },
  {
    "title": "I AM IRON MAN",
    "kind": "TERMINAL EVENT",
    "desc": "Tony transfers the Stones from Thanos's gauntlet and snaps away Thanos's invading 2014 forces.",
    "people": [
      {
        "name": "Tony Stark",
        "target": "dossier-001"
      },
      {
        "name": "Thanos (2014 variant)",
        "target": "dossier-014"
      }
    ]
  }
];
  const buttons = [...document.querySelectorAll('.battleevent')];
  const panel = document.getElementById('eventpanel');
  const people = document.getElementById('eventpeople');
  let current = 0;
  function show(index) {
    current = (index + events.length) % events.length;
    const event = events[current];
    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === current);
      button.setAttribute('aria-pressed', String(i === current));
      button.setAttribute('aria-controls', 'eventpanel');
    });
    panel.querySelector('small').textContent = 'TVA TACTICAL NODE // ' + event.kind;
    panel.querySelector('h3').textContent = event.title;
    panel.querySelector('p').textContent = event.desc;
    people.replaceChildren();
    event.people.forEach(person => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = person.name;
      button.dataset.target = person.target;
      button.addEventListener('click', () => window.TVA.reveal(person.target));
      people.append(button);
    });
    document.getElementById('battlecount').textContent = `NODE ${String(current + 1).padStart(2,'0')} / ${String(events.length).padStart(2,'0')} — ${event.title}`;
  }
  document.getElementById('battlecount').setAttribute('role','status');
  buttons.forEach((button, i) => button.addEventListener('click', () => show(i)));
  document.getElementById('prevbattle').addEventListener('click', () => show(current - 1));
  document.getElementById('nextbattle').addEventListener('click', () => show(current + 1));
  show(0);
})();

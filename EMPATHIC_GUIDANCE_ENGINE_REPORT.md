# Empathic Guidance Engine Report

## Empathy Architecture

Milestone 5E keeps the existing deterministic architecture and deepens the behavior inside `lib/conversation/conversationIntelligence.ts`.

The conversation model now follows:

Story -> Validation -> Understanding -> Interpretation -> Reflection -> Direction

Direction is no longer the first move. The assistant first names the emotional weight, then shows understanding, then offers careful interpretation.

## Validation Layer

The validation layer acknowledges what the parent may be carrying before analysis begins.

Examples:

- "Dat klinkt ontzettend zwaar om tegelijk bezorgd te zijn om je kind en het gevoel te hebben dat jij degene bent die alles moet blijven dragen."
- "Dat klinkt heel eenzaam om mee rond te lopen, zeker als je het gevoel hebt dat er weinig mensen echt naast je staan."

The goal is not to flatter or diagnose. The goal is to help the parent feel seen before the system gives direction.

## Listen Mode

Listen Mode is the default early conversation mode.

Characteristics:

- validates emotional weight
- shows understanding without repeating facts
- offers gentle interpretation
- asks insight-oriented reflection questions
- avoids quick action lists

Listen Mode is used especially when the first message contains overload, isolation, shame, guilt, fear, or confusion.

## Direction Mode

Direction Mode appears later, after more conversation or when the situation clearly needs organizing.

Characteristics:

- gives practical direction
- prioritizes relief and clarity
- keeps next steps small
- avoids bureaucratic language

Direction Mode still stays bounded: no therapy, diagnosis, legal advice, medical advice, or emergency replacement.

## Reflection Strategies

Reflection questions now focus on meaning and relief, not data collection.

Examples:

- "Wat doet het meest pijn in deze situatie: de zorgen rond je kind, of het gevoel dat jij dit allemaal moet blijven dragen?"
- "Als er vandaag een betrouwbare volwassene naast je stond, welk stuk zou dan meteen lichter voelen?"
- "Welke keuze zou vandaag al genoeg zijn, zelfs als de rest nog onduidelijk blijft?"

## Limitations

- The engine remains deterministic.
- It can miss subtle phrasing outside the current rules.
- It can infer a pattern too strongly if a keyword appears without enough context.
- It does not replace professional support.
- Hermes and Ryzen integrations were not implemented.

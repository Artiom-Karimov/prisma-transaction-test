# Proof of concept: Promise.all inside prisma transaction

This repo contains several tests that prove Promise.all supremacy over sequential awaits inside of a transaction.

Also `sequential.spec.ts` proves its stability and synchronous nature inside of prisma's transaction.

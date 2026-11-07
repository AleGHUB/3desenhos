"""Trilha do teardown Flexível · Adesivo Monocomponente: uma base leve (Fmaj9, 92 bpm) num nível só, o motor suave do
aplicador enquanto corre a telha, ar sob a chapa descendo, um baque abafado quando os pesos assentam, um ar fino durante
a cura com a umidade, um sino quando a cura conclui e outro na chamada final, e um clique em cada botão do operador.

    python <SKILL_DIR>/run_sfx.py clientes/grupo-flexivel/teardown-adesivo/score.py

Tempos tirados de main.js (SCRIPT, T0 = 0.8) e panel.js (STEPS); a duração vem de timeline.json.
"""

import os

from sfx.score_kit import airy, bed, chords, hiss, hz, motor, thud
from sfx.synth import chime, click

TIMELINE = "timeline.json"
OUT = os.path.join(os.environ.get("TEARDOWN_OUT", "teardown-out"), "flexivel-adesivo-score.wav")
TARGET_LUFS = -14.0
SEED = 23

T0 = 0.8
CHORDS = chords("Fmaj9:F2 C3 E3 G3 A3/F1", "Dm9:D2 A2 C3 E3 F3/D1", "Bbmaj7:Bb2 F3 A3 D4/Bb1", "C6sus:C3 F3 G3 A3 D4/C2")
MOTIF = [(0.5, hz("A5")), (1.5, hz("C6")), (2.5, hz("G5"))]
# botões do roteiro e inícios das etapas 2, 3 e 4 (o cursor clica na linha do tempo)
CLICKS = (1.4, 6.6, T0 + 7.5, 10.6, T0 + 10.0, 13.8, T0 + 12.5, 20.6, 21.0, 21.9, 25.0, 27.6, 28.0, 28.3, 28.6)


def score(mix, tl):
    dur = tl["duration"]
    left, right, low, drums = bed(dur, 92, CHORDS, MOTIF, motif_voice="epiano", kicks=(0, 2.5), snares=(), hats=8, swing=0.0, keys_vel=0.65, keys_lp=3400)
    mix.put_stereo(0, left, right, 0.12)
    mix.put(0, low, 0.11)
    mix.put(0, drums, 0.04)
    # aplicador correndo a telha (s 0..5)
    mix.put(T0 + 0.1, motor(4.9, 150, 1100, 9), 0.016)
    # chapa descendo (s 7.5..10)
    mix.put(T0 + 7.6, airy(2.3, 900, 300, 0.7), 0.03)
    # pesos assentando (s ~11)
    mix.put(T0 + 10.9, thud(70, 0.06, 0.45), 0.1)
    mix.put(T0 + 11.05, thud(85, 0.05, 0.4), 0.07)
    # umidade do ar durante a cura (s 12..18.5)
    mix.put(T0 + 12.0, hiss(6.6, 6200, 0.6), 0.008)
    # cura concluída e chamada final
    mix.put(T0 + 18.5, chime([hz("C6"), hz("G6")], 1.8, 0.6), 0.04)
    mix.put(30.2, chime([hz("F5"), hz("A5"), hz("C6")], 2.4, 0.8), 0.05)
    for t in CLICKS:
        mix.put(t, click(2400, 0.025), 0.05)

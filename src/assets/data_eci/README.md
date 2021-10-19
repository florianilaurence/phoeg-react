Dans les fichiers, les valeurs suivantes sont utilisées :

* sig est la représentation du graphe au format graph6.
* n est l'ordre (nombre de sommets)
* m est la taille (nombre d'arêtes)
* d est la valeur de d_nm
* diam est le diamètre
* eci est l'indice de connectivité excentrique

Les fichiers sont les suivants :

* extremaux.csv contient la liste des graphes qui maximisent eci pour un ordre
  et une taille donnés.
* enveloppes contient les points de l'enveloppe convexe des graphes pour chaque
  valeur de n entre 2 et 9. Les invariants utilisés sont m et eci.
* points contient les coordonnées des points dans l'enveloppe convexe ainsi que
  leurs multiplicités (nombre de graphe représenté par le points)
* graphes contient les graphes au format graph6 et les valeurs des différents
  invariants étudiés pour n entre 2 et 9.

import re


def read_envelope(path, invariant):
    envelope = open(path, "r")
    content = envelope.read()
    splited = re.split(",|\s", content)
    if splited[0] == invariant:
        res = []
        i = 2
        while i < len(splited) - 1:
            x, y = splited[i], splited[i + 1]
            res.append((float(x), float(y)))
            i += 2
            envelope.close()
        return res

    else:
        envelope.close()
        raise IOError


def read_points(path):
    points = open(path, "r")
    content = points.read()
    splited = re.split(",|\s", content)
    names = splited[2:4]
    res = []
    i = 4
    while i < len(splited) - 1:
        x, y, metric1, metric2 = splited[i], splited[i + 1], splited[i + 2], splited[i + 3]
        res.append((float(x), float(y), float(metric1), float(metric2)))
        i += 4
        points.close()
    return names, res

    points.close()
    return res


print(read_envelope("../assets/data_avcol/enveloppes/enveloppe-7.csv", "avcol"))
print(read_points("../assets/data_avcol/points/points-7.csv"))

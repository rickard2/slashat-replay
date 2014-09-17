<?php

require dirname(__FILE__) . '/logParser.php';

function isAdded($id)
{
    global $episodes;

    foreach ($episodes as $episode) {
        if ($episode->id === $id) {
            return true;
        }
    }

    return false;
}

function getName($item)
{
    $name = $item->title;

    $hashPosition = strpos($name, '#');

    return substr($name, $hashPosition);
}

function createEpisode($id, $name, $start)
{
    $episode             = new stdClass;
    $episode->id         = $id;
    $episode->name       = $name;
    $episode->start      = $start;
    $episode->exactStart = false;

    return $episode;
}

function getLog($episode)
{
    $date        = substr($episode->start, 0, 10);
    $filterStart = $episode->start;
    $filterEnd   = (new DateTime($episode->start))->add(new DateInterval('PT1H30M'))->format('Y-m-d H:i:s');

    $parser = new IrssiParser($filterStart, $filterEnd, 'logs/slashat.log', $date);

    return $parser->parse();
}

function getStart($item)
{
    $first = '2009-03-24';

    preg_match('/#(\d+)/', $item->title, $matches);

    $ep = $matches[1];

    $start = (new DateTime($first))->add(DateInterval::createFromDateString(($ep - 1) . ' weeks'));

    $newTime = $start > new DateTime('2014-09-01');

    $time = $newTime ? '21:00:00' : '20:00:00';

    return $start->format('Y-m-d') . ' ' . $time;
}

function findExactStart($log)
{
    foreach ($log as $row) {
        if (is_object($row) && $row->text === '.startlog') {
            return $row->$time;
        }

        if (is_array($row) && $row['text'] === '.startlog') {
            return $row['time'];
        }
    }

    return false;
}

function storeLog($episode, $log)
{
    file_put_contents('data/' . $episode->id . '.json', json_encode($log));
}

/**
 * @return mixed|string
 */
function getFeed()
{
    $feed = file_get_contents('https://gdata.youtube.com/feeds/api/users/slashatse/uploads?alt=jsonc&v=2');
    return json_decode($feed);
}

$feed = getFeed();

$episodes = json_decode(file_get_contents('data/episodes.json'));

$items = $feed->data->items;

foreach ($items as $item) {
    $id = $item->id;

    if (!isAdded($id)) {

        $name  = getName($item);
        $start = getStart($item);

        $episode = createEpisode($id, $name, $start);

        array_unshift($episodes, $episode);

        $log = getLog($episode);

        if (!$log) {
            var_dump($episode);
            die('no log found for ' . $id);
        }

        $exactStart = findExactStart($log);

        if ($exactStart) {
            $episode->start      = $exactStart;
            $episode->exactStart = true;
        }

        storeLog($episode, $log);
    }
}

usort(
    $episodes,
    function ($episodeA, $episodeB) {
        return strnatcasecmp($episodeB->name, $episodeA->name);
    }
);

file_put_contents('data/episodes.json', json_encode($episodes));
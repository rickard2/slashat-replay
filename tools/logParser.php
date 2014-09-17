<?php

class IrssiParser
{
    public function __construct($filterStart, $filterEnd, $logFile, $logStartDate)
    {
        $log            = file_get_contents($logFile);
        $this->log      = explode("\n", $log);
        $this->date     = $logStartDate;
        $this->messages = [];

        $this->filterStart = strtotime($filterStart);
        $this->filterEnd   = strtotime($filterEnd);
    }

    public function parse()
    {
        foreach ($this->log as $row) {

            $is_date    = preg_match('/^--- (Log opened|Day changed) \S+ (.+)$/i', $row, $matches);
            $is_message = preg_match('/^(\d{2}:\d{2}:\d{2}):[~+@& ]?([a-z0-9-_^|]+): (.*)$/i', $row, $message_matches);
            $is_action  = preg_match('/^(\d{2}:\d{2}:\d{2}) - ([a-z0-9-_^|]+) (.+)?$/i', $row, $me_matches);
            $skip       = $this->skip($row);

            if ($is_date) {
                $enDate = str_replace('maj', 'may', $matches[2]);
                $date   = strtotime($enDate);

                if ($date) {
                    $this->date = $date;
                } else {
                    var_dump('unable to parse date: ' . $matches[2]);
                    die();
                }
            } elseif ($is_message) {
                $this->addMessage($message_matches);
            } elseif ($is_action) {
                $this->addMessage($me_matches);
            } elseif (!$skip) {
                var_dump('unable to parse: ' . $row);
                die();
            }
        }

        return $this->messages;
    }

    function addMessage($matches)
    {
        if (is_string($this->date)) {
            var_dump($this->date);
            die();
        }

        $time  = date('Y-m-d', $this->date) . ' ' . $matches[1];
        $timeU = strtotime($time);

        if ($timeU >= $this->filterStart && $timeU <= $this->filterEnd) {
            $this->messages[] = [
                'time' => $time,
                'user' => $matches[2],
                'text' => $matches[3],
            ];
        }
    }

    function skip($row)
    {
        $skipStrings = [
            ' changed the topic of #slashat to: ',
            'Irssi: #slashat: Total of ',
            '--- Log closed ',
            'Join to #slashat was synced in ',
            ':#slashat- CHANGE ',
        ];

        foreach ($skipStrings as $string) {
            if (strstr($row, $string)) {
                return true;
            }
        }

        if (!$row) {
            return true;
        }

        return false;
    }
}

class StenehallParser
{
    public function __construct($filterStart, $filterEnd, $logFile)
    {
        $log            = file_get_contents($logFile);
        $this->log      = explode("\n", $log);
        $this->messages = [];

        $this->filterStart = strtotime($filterStart);
        $this->filterEnd   = strtotime($filterEnd);
    }

    public function parse()
    {
        foreach ($this->log as $row) {

            $is_message = preg_match(
                '/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) [+@]?([a-z0-9-_^|]+) {1,2}(.+)$/i',
                $row,
                $message_matches
            );
            $is_action  = preg_match('/^(\d{2}:\d{2}:\d{2}) - ([a-z0-9-_^|]+) (.+)$/i', $row, $me_matches);
            $skip       = $this->skip($row);

            if ($skip) {
                continue;
            }

            if ($is_message) {
                $this->addMessage($message_matches);
            } elseif ($is_action) {
                $this->addMessage($me_matches);
            } else {
                var_dump('unable to parse: ' . $row);
                die();
            }
        }

        return $this->messages;
    }

    function addMessage($matches)
    {
        $time  = $matches[1] . ' ' . $matches[2];
        $timeU = strtotime($time);

        if ($timeU >= $this->filterStart && $timeU <= $this->filterEnd) {
            $this->messages[] = [
                'time' => $time,
                'user' => $matches[3],
                'text' => $matches[4],
            ];
        }
    }

    function skip($row)
    {
        $skipStrings = [
            ' is now known as ',
            ' --  Mode #',
            ') has left #',
            ') has joined #',
            ') has quit (',
        ];

        foreach ($skipStrings as $string) {
            if (strstr($row, $string)) {
                return true;
            }
        }

        if (!$row) {
            return true;
        }

        return false;
    }
}

class BaggeParser
{
    public function __construct($filterStart, $filterEnd, $logFile, $logStartDate)
    {
        $log            = file_get_contents($logFile);
        $this->log      = explode("\n", $log);
        $this->date     = $logStartDate;
        $this->messages = [];

        $this->filterStart = strtotime($filterStart);
        $this->filterEnd   = strtotime($filterEnd);
    }

    public function parse()
    {
        foreach ($this->log as $row) {

            $is_date    = preg_match('/^--- (Log opened|Day changed) \S+ (.+)$/i', $row, $matches);
            $is_message = preg_match(
                '/^\[(\d{2}:\d{2}:\d{2})\] <[~+@ ]?([a-z0-9-_^|]+)> (.+)$/i',
                $row,
                $message_matches
            );
            $is_action  = preg_match('/^(\d{2}:\d{2}:\d{2}) - ([a-z0-9-_^|]+) (.+)?$/i', $row, $me_matches);
            $skip       = $this->skip($row);

            if ($is_date) {

                $date = strtotime($matches[2]);

                if ($date) {
                    $this->date = $date;
                } else {
                    var_dump('unable to parse date: ' . $date);
                    die();
                }
            } elseif ($is_message) {
                $this->addMessage($message_matches);
            } elseif ($is_action) {
                $this->addMessage($me_matches);
            } elseif (!$skip) {
                var_dump('unable to parse: ' . $row);
                die();
            }
        }

        return $this->messages;
    }

    function addMessage($matches)
    {
//        if (is_string($this->date)) {
//            var_dump($this->date);
//            die();
//        }

        $time  = $this->date . ' ' . $matches[1];
        $timeU = strtotime($time);

        if ($timeU >= $this->filterStart && $timeU <= $this->filterEnd) {
            $this->messages[] = [
                'time' => $time,
                'user' => $matches[2],
                'text' => $matches[3],
            ];
        }
    }

    function skip($row)
    {
        $skipStrings = [
            ' changed the topic of #slashat to: ',
            'Irssi: #slashat: Total of ',
            '--- Log closed ',
            'Join to #slashat was synced in ',
            ':#slashat- CHANGE ',
        ];

        foreach ($skipStrings as $string) {
            if (strstr($row, $string)) {
                return true;
            }
        }

        if (!$row) {
            return true;
        }

        return false;
    }
}


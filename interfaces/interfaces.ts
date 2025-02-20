
export interface Messages {
    invite: InviteMessages;
    lang: LangMessages;
    trivia: TriviaMessages;
    duel: DuelMessages;
    guessNumber: GuessNumberMessages;
    help: HelpMessages;
    leaderboard: LeaderboardMessages;
    scramble: ScrambleMessages;
    cmd_error: string;
    greeting: string;
    farewell: string;
}
export interface InviteMessages {
    copy_discord_link: string;
    get_discord_link: string;
    click_to_get_discord_link: string;
    the_link_is: string;
    please_copy_manually: string;
}

export interface LangMessages {
    language_set: string;
}

export interface TriviaMessages {
    congrats: string;
    good_answer: string;
    bad_answer: string;
    little_story: string;
    discover_more: string;
    times_up: string;
    click_on_the_wiki_link: string;
    the_good_answer: string;
    trivia_questions: string;
    no_questions: string;
    error_while_fetching: string;
    try_later: string;
    have_win_x_points: string;
    points: string;
    select_answer: string;
    thank_you: string;
}
export interface DuelMessages {
    start_duel: string;
    stop_duel: string;
    cannot_duel_yourself: string;
    duel_started: string;
    duel_stopped: string;
    duel_not_started: string;
    duel_already_started: string;
    duel_already_stopped: string;
    duel_in_progress: string;
    duel_accepted: string;
    duel_declined: string;
    declined_maybe_next_time: string;
    will_start_soon: string;
    challenged_by: string;
    challenger: string;
    challenged: string;
    accept: string;
    decline: string;
    time_up: string;
    did_not_respond: string;
    duel_countdown:string;
    seconds_get_ready: string;
    go_shoot: string;
    shoot_word: string;
    congrats: string;
    won_against: string;
    time_up_no_one_won: string;
}
export interface GuessNumberMessages {
    title: string,
    not_a_number: string,
    too_high: string,
    too_low: string,
    correct: string,
    im_thinking_of: string,
    and: string,
    you_have: string,
    attempts_to_guess: string,
    attempts_left: string;
    congrats: string;
    in: string;
    attempts: string;
    sorry_you_have_used_all_of_your_attempts: string;
    better_luck_next_time: string;
    times_up_the_number_was:string;
    thanks_for_playing: string;
}
export interface HelpMessages {
    list_of_commands: string;
    cmd: string;
    get_discord_link: string;
    game: string;
    help: string;
    if_you_have_any_questions: string;
}
export interface LeaderboardMessages {
    no_users_found: string;
    leaderboard_title: string;
    cmd_error: string;
}
export interface ScrambleMessages {
    prompt: string,
    correct: string,
    incorrect: string,
    timemout:string;
    game_over: string;
    you_have_30s_to_guess: string,
    correct_guess: string,
    good_job: string;
    incorrect_guess: string,
    you_have: string;
    attempts_left: string,
    times_up:string;
    attempts_used: string;
    gameOver: string;
    better_luck_next_time: string;
}

import os
import re


PARENT_DIR = os.path.join(os.path.dirname(__file__), 'albums')
ALBUM_ARTIST = {
    'Ages Ago': 'Flovry Tender Spring',
    'Better Together': 'Marsquake Satyr',
    'Cocobolo': 'HM Surf',
    'Florist': 'Lilac',
    'Illusion': 'Chiccote\'s Beats',
    'Inside Space': 'TABAL',
    'Life Forms': 'Kupla',
    'Poles Apart': 'Slowburn',
    'Sleeping Soul': 'Tenno',
    'Solitude': 'cxlt. amies',
    'Window Seat': 'takeo (aka Tysu) spencer hunt'
}


def rename_albums() -> None:
    """Removes any dashes in the albums names"""

    for album in os.listdir(PARENT_DIR):
        if '-' in album:
            os.rename(
                os.path.join(PARENT_DIR, album),
                os.path.join(PARENT_DIR, album.replace('-', ' '))
            )


def clean_album() -> None:
    """
    Renames each song in each album folder. Adds the album
    and artist name to each song.
    """
    rename_albums()
    for album in os.listdir(PARENT_DIR):
        if album == '.DS_Store':
            continue
        artist = ALBUM_ARTIST[album]
        renumber_songs(album)
        remove_bracket_info(album)
        remove_common_words(album)
        rename_songs(artist, album)


def renumber_songs(album: str) -> None:
    """
    Renumbers each song to follow the pattern 01, 02, ..., 10, 11
    Args:
        album (str): the name of the folder with the album
    """
    fp = os.path.join(PARENT_DIR, album)
    track = 1
    for song_name in os.listdir(fp):
        if song_name == '.DS_Store':
            continue
        old_name = os.path.join(fp, song_name)
        while song_name[0].isnumeric() or song_name[0] in ['-', '.', ' ']:
            song_name = song_name[1:]
        new_name = os.path.join(fp, f'{track:02}-{song_name}')
        os.rename(old_name, new_name)
        track += 1
    return


def remove_bracket_info(album: str) -> None:
    """
    Removes any information that is in parenthesis or brackets
    Args:
        album (str): the name of the folder with the album
    """
    fp = os.path.join(PARENT_DIR, album)
    for song_name in os.listdir(fp):
        if song_name == '.DS_Store':
            continue
        old_name = os.path.join(fp, song_name)
        song_name = re.sub(r'\s?\[.*?\]\s?|\s?\(.*?\)\s?', '', song_name)
        new_name = os.path.join(fp, song_name)
        os.rename(old_name, new_name)
    return


def remove_common_words(album: str) -> None:
    """
    Removes common phrases from songs in an albums. These phrases are
    the alums name or artist and are added in a different function.
    Args:
        album (str): the name of the folder with the album
    """
    songs = []
    fp = os.path.join(PARENT_DIR, album)
    common_words = set()

    for song_name in os.listdir(fp):
        if song_name == '.DS_Store':
            continue
        songs.append([component.strip() for component in song_name.split('-')])

    for i, song in enumerate(songs):
        for component in song:
            for j, song in enumerate(songs):
                if i == j:
                    continue
                if component in song:
                    common_words.add(component)

    for old_name, song in zip(os.listdir(fp), songs):
        new_name = '-'.join([
            comp.title() for comp in song if comp not in common_words
        ]).replace(' .mp3', '.mp3')        
        os.rename(os.path.join(fp, old_name), os.path.join(fp, new_name))


def rename_songs(artist: str, album: str) -> None:
    """
    Adds the artist and album to the song's file name.

    Args:
        artist (str): the name of the artist for the album
        album (str): the name of the folder with the album
    """
    fp = os.path.join(PARENT_DIR, album)
    for song_name in os.listdir(fp):
        if song_name == '.DS_Store':
            continue
        old_name = os.path.join(fp, song_name)
        new_name = f"{song_name.replace('.mp3', '')}-{album}-{artist}.mp3"
        new_name = new_name.replace('.Mp3-', '-')
        new_name = os.path.join(fp, new_name)
        os.rename(old_name, new_name)



if __name__ == '__main__':
    clean_album()
